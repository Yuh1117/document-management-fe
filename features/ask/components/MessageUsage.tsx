'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Gauge } from 'lucide-react'
import { estimateCost, formatNumber as num, formatUsd } from '@/features/ask/lib/pricing'
import type { IChatUsage } from '@/types/type'

const Row = ({ label, value }: { label: string; value: string }) => (
  <span className="flex justify-between gap-3">
    <span className="text-muted-foreground">{label}</span>
    <span>{value}</span>
  </span>
)

/** Small gauge next to an answer; hover, focus or tap shows its token usage. */
const MessageUsage = ({ usage, model }: { usage: IChatUsage; model: string | null }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const cost = estimateCost(
    {
      inputTokens: usage.input_tokens,
      cachedTokens: usage.cached_tokens,
      outputTokens: usage.output_tokens,
    },
    model
  )

  return (
    <span
      className="relative inline-flex align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={t('ask.usage_title')}
        className="cursor-pointer text-muted-foreground/60 hover:text-foreground"
        onClick={() => setOpen((v) => !v)}
      >
        <Gauge size={12} aria-hidden />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-0 z-20 mb-1 flex w-56 flex-col gap-0.5 rounded-lg border bg-popover p-2 text-[11px] tabular-nums text-popover-foreground shadow-md"
        >
          <Row
            label={t('ask.usage_input')}
            value={t('ask.usage_input_value', {
              total: num(usage.input_tokens),
              cached: num(usage.cached_tokens),
            })}
          />
          <Row label={t('ask.usage_output')} value={num(usage.output_tokens)} />
          <Row label={t('ask.usage_llm_calls')} value={num(usage.llm_calls)} />
          <Row label={t('ask.usage_tool_calls')} value={num(usage.tool_calls)} />
          <Row label={t('ask.usage_cost')} value={cost == null ? '?' : formatUsd(cost)} />
        </span>
      )}
    </span>
  )
}

export default MessageUsage
