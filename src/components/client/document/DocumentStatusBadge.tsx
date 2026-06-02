import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { IDocument } from '@/types/type'
import { CheckCircle2, CircleDashed, LoaderCircle, XCircle } from 'lucide-react'

type Props = {
  document: IDocument
  className?: string
  compact?: boolean
}

const badgeClassByVariant: Record<string, string> = {
  neutral: 'border-muted-foreground/20 bg-muted text-muted-foreground',
  warning:
    'border-amber-500/25 bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  success:
    'border-emerald-500/25 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  danger: 'border-red-500/25 bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
}

const fallbackBadgeByStatus: Record<string, { label: string; variant: string }> = {
  NOT_PROCESSED: { label: 'Chưa xử lý', variant: 'neutral' },
  PROCESSING: { label: 'Đang xử lý', variant: 'warning' },
  COMPLETED: { label: 'Hoàn tất', variant: 'success' },
  FAILED: { label: 'Thất bại', variant: 'danger' },
}

const iconByVariant = {
  neutral: CircleDashed,
  warning: LoaderCircle,
  success: CheckCircle2,
  danger: XCircle,
}

const getBadge = (document: IDocument) => {
  if (!document.processingStatus) {
    return fallbackBadgeByStatus.NOT_PROCESSED
  }

  return fallbackBadgeByStatus[document.processingStatus] ?? fallbackBadgeByStatus.NOT_PROCESSED
}

const DocumentStatusBadge = ({ document, className, compact = false }: Props) => {
  const badge = getBadge(document)

  if (!badge) return null

  if (compact) {
    const Icon = iconByVariant[badge.variant as keyof typeof iconByVariant] ?? CircleDashed

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              'inline-flex size-5 shrink-0 items-center justify-center rounded-full border',
              badge.variant === 'warning' && 'animate-pulse',
              badgeClassByVariant[badge.variant] ?? badgeClassByVariant.neutral,
              className
            )}
            aria-label={badge.label}
          >
            <Icon className={cn('size-3', badge.variant === 'warning' && 'animate-spin')} />
          </span>
        </TooltipTrigger>
        <TooltipContent>{badge.label}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'h-5 max-w-full rounded-md px-1.5 text-[10px] leading-none',
        badgeClassByVariant[badge.variant] ?? badgeClassByVariant.neutral,
        className
      )}
      title={badge.label}
    >
      {badge.label}
    </Badge>
  )
}

export default DocumentStatusBadge
