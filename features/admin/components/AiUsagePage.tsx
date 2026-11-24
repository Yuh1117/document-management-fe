'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshCw } from 'lucide-react'
import api, { endpoints } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { estimateCost, formatNumber as num, formatUsd } from '@/features/ask/lib/pricing'
import type { IAiUsage } from '@/types/type'

const RANGES = [7, 30, 90] as const
const TOP_USERS = 10

interface Totals {
  answers: number
  inputTokens: number
  cachedTokens: number
  outputTokens: number
  llmCalls: number
  toolCalls: number
  /** USD; null when some rows use a model without a known price. */
  cost: number | null
  /** True when at least one row could not be priced. */
  unpriced: boolean
}

const emptyTotals = (): Totals => ({
  answers: 0,
  inputTokens: 0,
  cachedTokens: 0,
  outputTokens: 0,
  llmCalls: 0,
  toolCalls: 0,
  cost: 0,
  unpriced: false,
})

const addRow = (
  totals: Totals,
  row: {
    model: string
    answers: number
    inputTokens: number
    cachedTokens: number
    outputTokens: number
    llmCalls?: number
    toolCalls?: number
  }
) => {
  totals.answers += row.answers
  totals.inputTokens += row.inputTokens
  totals.cachedTokens += row.cachedTokens
  totals.outputTokens += row.outputTokens
  totals.llmCalls += row.llmCalls ?? 0
  totals.toolCalls += row.toolCalls ?? 0
  const cost = estimateCost(row, row.model || null)
  if (cost == null) totals.unpriced = true
  else totals.cost = (totals.cost ?? 0) + cost
}

const costText = (totals: Totals) =>
  totals.cost == null ? '?' : `${formatUsd(totals.cost)}${totals.unpriced ? '*' : ''}`

const tokensText = (totals: Totals) => `${num(totals.inputTokens)} / ${num(totals.outputTokens)}`

const Stat = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <Card className="gap-1 p-4">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-2xl font-semibold tabular-nums">{value}</span>
    {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
  </Card>
)

const AiUsagePage = () => {
  const { t } = useTranslation()
  const [days, setDays] = useState<(typeof RANGES)[number]>(30)
  const [data, setData] = useState<IAiUsage | null>(null)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setFailed(false)
    try {
      const res = await api.get(endpoints['admin-ai-usage'], { params: { days } })
      setData(res.data.data as IAiUsage)
    } catch (err) {
      console.error('Failed to load AI usage', err)
      setFailed(true)
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    void load()
  }, [load])

  const view = useMemo(() => {
    if (!data) return null
    const total = emptyTotals()
    const byDay = new Map<string, Totals>()
    const byModel = new Map<string, Totals>()
    for (const row of data.daily) {
      addRow(total, row)
      if (!byDay.has(row.date)) byDay.set(row.date, emptyTotals())
      addRow(byDay.get(row.date)!, row)
      const model = row.model || '—'
      if (!byModel.has(model)) byModel.set(model, emptyTotals())
      addRow(byModel.get(model)!, row)
    }

    const questionsByDay = new Map(data.questions.map((q) => [q.date, q.questions]))
    const questions = data.questions.reduce((sum, q) => sum + q.questions, 0)
    const dates = [...new Set([...byDay.keys(), ...questionsByDay.keys()])].sort().reverse()

    const byUser = new Map<string, { email: string; name: string; totals: Totals }>()
    for (const row of data.users) {
      if (!byUser.has(row.userId)) {
        byUser.set(row.userId, { email: row.email, name: row.name, totals: emptyTotals() })
      }
      addRow(byUser.get(row.userId)!.totals, row)
    }
    const users = [...byUser.values()]
      .sort(
        (a, b) =>
          b.totals.inputTokens +
          b.totals.outputTokens -
          (a.totals.inputTokens + a.totals.outputTokens)
      )
      .slice(0, TOP_USERS)

    return { total, questions, dates, byDay, questionsByDay, byModel, users }
  }, [data])

  const total = view?.total
  const cacheShare =
    total && total.inputTokens > 0 ? Math.round((total.cachedTokens / total.inputTokens) * 100) : 0
  const unpriced = !!total?.unpriced

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex w-full items-center justify-between gap-2 px-4">
          <span>{t('admin.ai_usage_title')}</span>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-muted p-[3px] text-sm">
              {RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setDays(r)}
                  aria-pressed={days === r}
                  className={cn(
                    'cursor-pointer rounded-md px-3 py-1 text-muted-foreground transition-colors',
                    days === r && 'bg-background text-foreground shadow-sm'
                  )}
                >
                  {t('admin.ai_usage_days', { count: r })}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => void load()}
              disabled={loading}
              aria-label={t('admin.ai_usage_refresh')}
            >
              <RefreshCw className={loading ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>
      </header>

      <div className="space-y-6 p-4">
        {failed && (
          <p className="py-10 text-center text-sm text-destructive">{t('admin.ai_usage_failed')}</p>
        )}
        {!view && loading && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}

        {view && total && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat
                label={t('admin.ai_usage_questions')}
                value={num(view.questions)}
                hint={t('admin.ai_usage_answers_hint', { count: total.answers })}
              />
              <Stat
                label={t('admin.ai_usage_input')}
                value={num(total.inputTokens)}
                hint={t('admin.ai_usage_cached_hint', {
                  cached: num(total.cachedTokens),
                  percent: cacheShare,
                })}
              />
              <Stat label={t('admin.ai_usage_output')} value={num(total.outputTokens)} />
              <Stat
                label={t('admin.ai_usage_cost')}
                value={costText(total)}
                hint={t('admin.ai_usage_calls_hint', {
                  llm: num(total.llmCalls),
                  tools: num(total.toolCalls),
                })}
              />
            </div>

            <section className="rounded-xl border p-5 shadow-xs">
              <h2 className="mb-3 font-medium">{t('admin.ai_usage_by_day')}</h2>
              {view.dates.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  {t('admin.ai_usage_empty')}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.ai_usage_date')}</TableHead>
                      <TableHead className="text-right">{t('admin.ai_usage_questions')}</TableHead>
                      <TableHead className="text-right">{t('admin.ai_usage_input')}</TableHead>
                      <TableHead className="text-right">{t('admin.ai_usage_cached')}</TableHead>
                      <TableHead className="text-right">{t('admin.ai_usage_output')}</TableHead>
                      <TableHead className="text-right">{t('admin.ai_usage_llm_calls')}</TableHead>
                      <TableHead className="text-right">{t('admin.ai_usage_tool_calls')}</TableHead>
                      <TableHead className="text-right">{t('admin.ai_usage_cost')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="tabular-nums">
                    {view.dates.map((date) => {
                      const d = view.byDay.get(date) ?? emptyTotals()
                      return (
                        <TableRow key={date}>
                          <TableCell className="font-medium">{date}</TableCell>
                          <TableCell className="text-right">
                            {num(view.questionsByDay.get(date) ?? 0)}
                          </TableCell>
                          <TableCell className="text-right">{num(d.inputTokens)}</TableCell>
                          <TableCell className="text-right">{num(d.cachedTokens)}</TableCell>
                          <TableCell className="text-right">{num(d.outputTokens)}</TableCell>
                          <TableCell className="text-right">{num(d.llmCalls)}</TableCell>
                          <TableCell className="text-right">{num(d.toolCalls)}</TableCell>
                          <TableCell className="text-right">{costText(d)}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-xl border p-5 shadow-xs">
                <h2 className="mb-3 font-medium">{t('admin.ai_usage_top_users')}</h2>
                {view.users.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    {t('admin.ai_usage_empty')}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('admin.ai_usage_user')}</TableHead>
                        <TableHead className="text-right">{t('admin.ai_usage_answers')}</TableHead>
                        <TableHead className="text-right">{t('admin.ai_usage_tokens')}</TableHead>
                        <TableHead className="text-right">{t('admin.ai_usage_cost')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="tabular-nums">
                      {view.users.map((u) => (
                        <TableRow key={u.email}>
                          <TableCell>
                            <div className="font-medium">{u.name || u.email}</div>
                            <div className="text-xs text-muted-foreground">{u.email}</div>
                          </TableCell>
                          <TableCell className="text-right">{num(u.totals.answers)}</TableCell>
                          <TableCell className="text-right">{tokensText(u.totals)}</TableCell>
                          <TableCell className="text-right">{costText(u.totals)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </section>

              <section className="rounded-xl border p-5 shadow-xs">
                <h2 className="mb-3 font-medium">{t('admin.ai_usage_by_model')}</h2>
                {view.byModel.size === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    {t('admin.ai_usage_empty')}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('admin.model_name')}</TableHead>
                        <TableHead className="text-right">{t('admin.ai_usage_answers')}</TableHead>
                        <TableHead className="text-right">{t('admin.ai_usage_tokens')}</TableHead>
                        <TableHead className="text-right">{t('admin.ai_usage_cost')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="tabular-nums">
                      {[...view.byModel.entries()].map(([model, m]) => (
                        <TableRow key={model}>
                          <TableCell className="font-medium">{model}</TableCell>
                          <TableCell className="text-right">{num(m.answers)}</TableCell>
                          <TableCell className="text-right">{tokensText(m)}</TableCell>
                          <TableCell className="text-right">{costText(m)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </section>
            </div>

            <p className="text-xs text-muted-foreground">
              {t('admin.ai_usage_note')}
              {unpriced && ` ${t('admin.ai_usage_unpriced_note')}`}
            </p>
          </>
        )}
      </div>
    </>
  )
}

export default AiUsagePage
