'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import api, { endpoints } from '@/lib/api'
import type {
  IDocument,
  IDocumentSummarize,
  ISummaryFeedbackDocumentStats,
  ISummaryFeedbackRes,
} from '@/types/type'
import { Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Props = {
  data: IDocument | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DocumentSummarizeModal = ({ data, open, onOpenChange }: Props) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<IDocumentSummarize | null>(null)
  const [feedbackStats, setFeedbackStats] = useState<ISummaryFeedbackDocumentStats | null>(null)
  const [myFeedback, setMyFeedback] = useState<ISummaryFeedbackRes | null>(null)
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [comment, setComment] = useState('')
  const [pendingVote, setPendingVote] = useState<boolean | null>(null)

  useEffect(() => {
    if (open) {
      setResult(null)
      setFeedbackStats(null)
      setMyFeedback(null)
      setShowCommentBox(false)
      setComment('')
      setPendingVote(null)
    }
  }, [open, data?.id])

  const loadFeedbackStats = async () => {
    if (!data) return
    try {
      const res = await api.get(endpoints['document-summary-feedback'](data.id))
      setFeedbackStats(res.data.data as ISummaryFeedbackDocumentStats)
    } catch (err) {
      console.error(err)
    }
  }

  const runSummarize = async () => {
    if (!data) return
    try {
      setLoading(true)
      const res = await api.get(endpoints['document-summarize'](data.id))
      setResult(res.data.data as IDocumentSummarize)
      await loadFeedbackStats()
      setMyFeedback(null)
    } catch (error: unknown) {
      console.error('Lỗi khi tóm tắt tài liệu', error)
      toast.error(t('document.summary_failed'), { duration: 3000 })
    } finally {
      setLoading(false)
    }
  }

  const handleVote = (isHelpful: boolean) => {
    if (myFeedback) return
    setPendingVote(isHelpful)
    setShowCommentBox(true)
    setComment('')
  }

  const submitFeedback = async () => {
    if (!data || pendingVote === null || !result) return
    try {
      setSubmittingFeedback(true)
      const res = await api.post(endpoints['document-summary-feedback'](data.id), {
        summaryId: result.id,
        isHelpful: pendingVote,
        comment: comment.trim() || undefined,
      })
      setMyFeedback(res.data.data as ISummaryFeedbackRes)
      setShowCommentBox(false)
      toast.success(t('document.summary_send_success'))
      await loadFeedbackStats()
    } catch {
      toast.error(t('document.summary_send_failed'))
    } finally {
      setSubmittingFeedback(false)
    }
  }

  const cancelFeedback = () => {
    setShowCommentBox(false)
    setPendingVote(null)
    setComment('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{t('document.summary_title')}</DialogTitle>
          <DialogDescription className="sr-only">{t('document.summary_prompt')}</DialogDescription>
        </DialogHeader>
        {data && (
          <p className="text-sm text-muted-foreground truncate" title={data.name}>
            {data.name}
          </p>
        )}
        {result ? (
          <ScrollArea className="max-h-[min(360px,50vh)] rounded-lg border p-3">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 text-sm leading-6 last:mb-0">{children}</p>,
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">{children}</strong>
                ),
                ul: ({ children }) => (
                  <ul className="mb-2 list-disc space-y-1 pl-5 text-sm leading-6">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-2 list-decimal space-y-1 pl-5 text-sm leading-6">{children}</ol>
                ),
                li: ({ children }) => <li>{children}</li>,
                h1: ({ children }) => <h1 className="mb-2 text-base font-semibold">{children}</h1>,
                h2: ({ children }) => <h2 className="mb-2 text-sm font-semibold">{children}</h2>,
                h3: ({ children }) => <h3 className="mb-1.5 text-sm font-semibold">{children}</h3>,
                code: ({ children }) => (
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">{children}</code>
                ),
                table: ({ children }) => (
                  <div className="mb-2 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border px-2 py-1 text-left font-semibold">{children}</th>
                ),
                td: ({ children }) => <td className="border px-2 py-1">{children}</td>,
              }}
            >
              {result.summaryText}
            </ReactMarkdown>
          </ScrollArea>
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            {t('document.summary_prompt')}
          </div>
        )}
        {result &&
          (() => {
            const meta: string[] = []
            if (result.modelName) meta.push(t('document.summary_model', { name: result.modelName }))
            return meta.length > 0 ? (
              <p className="text-xs text-muted-foreground">{meta.join(' · ')}</p>
            ) : null
          })()}

        {result && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {t('document.summary_helpful_question')}
              </p>
              {myFeedback ? (
                <p className="text-xs text-green-600">
                  {t('document.summary_voted', {
                    value: myFeedback.isHelpful
                      ? t('document.summary_helpful')
                      : t('document.summary_not_helpful'),
                  })}
                </p>
              ) : showCommentBox ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {t('document.summary_comment_label', {
                      vote: pendingVote
                        ? t('document.summary_helpful')
                        : t('document.summary_not_helpful'),
                    })}
                  </p>
                  <Textarea
                    placeholder={t('document.summary_comment_placeholder')}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={submitFeedback} disabled={submittingFeedback}>
                      {submittingFeedback ? <Spinner size={14} className="me-1.5" /> : null}
                      {t('document.summary_send')}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={cancelFeedback}
                      disabled={submittingFeedback}
                    >
                      {t('common.cancel')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleVote(true)}>
                    <ThumbsUp className="size-3.5 me-1" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleVote(false)}>
                    <ThumbsDown className="size-3.5 me-1" />
                  </Button>
                </div>
              )}
              {feedbackStats && feedbackStats.totalCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  {t('document.summary_stats', {
                    helpful: feedbackStats.helpfulCount,
                    total: feedbackStats.totalCount,
                  })}
                </p>
              )}
            </div>
          </>
        )}

        <DialogFooter className="gap-2">
          {result && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setResult(null)
                setFeedbackStats(null)
                setMyFeedback(null)
                setShowCommentBox(false)
                setPendingVote(null)
              }}
              disabled={loading}
            >
              {t('document.summary_clear')}
            </Button>
          )}
          <Button type="button" onClick={runSummarize} disabled={loading || !data}>
            {loading ? (
              <>
                <Spinner size={16} className="me-2" />
                {t('document.summary_creating')}
              </>
            ) : (
              <>
                <Sparkles className="size-4 me-2" />
                {result ? t('document.summary_regenerate') : t('document.summary_create')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DocumentSummarizeModal
