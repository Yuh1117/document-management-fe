'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageSquare, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { IChatConversation } from '@/types/type'

interface ConversationListProps {
  conversations: IChatConversation[]
  loading: boolean
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onRename: (id: string, title: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const ConversationList = ({
  conversations,
  loading,
  activeId,
  onSelect,
  onNew,
  onRename,
  onDelete,
}: ConversationListProps) => {
  const { t } = useTranslation()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<IChatConversation | null>(null)
  const [deleting, setDeleting] = useState(false)

  const startEdit = (c: IChatConversation) => {
    setEditingId(c.id)
    setDraft(c.title)
  }

  const commitEdit = async () => {
    const id = editingId
    const title = draft.trim()
    setEditingId(null)
    const current = conversations.find((c) => c.id === id)
    if (!id || !title || title === current?.title) return
    await onRename(id, title)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await onDelete(deleteTarget.id)
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-2 rounded-xl bg-background/40 p-2 md:flex">
      <Button variant="outline" className="justify-start" onClick={onNew}>
        <Plus className="size-4" />
        {t('ask.new_chat')}
      </Button>

      <p className="px-2 pt-2 text-xs font-medium text-muted-foreground">{t('ask.history')}</p>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-0.5 pr-2">
          {loading && (
            <div className="flex justify-center py-4">
              <Spinner size={16} />
            </div>
          )}
          {!loading && conversations.length === 0 && (
            <p className="px-2 py-4 text-xs text-muted-foreground">{t('ask.history_empty')}</p>
          )}
          {conversations.map((c) =>
            editingId === c.id ? (
              <Input
                key={c.id}
                autoFocus
                value={draft}
                maxLength={255}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => void commitEdit()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) void commitEdit()
                  if (e.key === 'Escape') setEditingId(null)
                }}
                className="h-8 text-sm"
              />
            ) : (
              <div
                key={c.id}
                className={cn(
                  'group flex items-center rounded-lg text-sm transition hover:bg-accent',
                  activeId === c.id && 'bg-accent font-medium'
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelect(c.id)}
                  title={c.title}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 px-2 py-1.5 text-left"
                >
                  <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{c.title}</span>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t('ask.conversation_actions')}
                        className="size-7 shrink-0 opacity-0 group-hover:opacity-100 data-popup-open:opacity-100"
                      />
                    }
                  >
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => startEdit(c)}>
                      <Pencil className="size-4" />
                      {t('ask.rename')}
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(c)}>
                      <Trash2 className="size-4" />
                      {t('ask.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )
          )}
        </div>
      </ScrollArea>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{t('ask.delete_confirm_title')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {t('ask.delete_confirm_desc', { title: deleteTarget?.title ?? '' })}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              {t('ask.cancel')}
            </Button>
            <Button variant="destructive" onClick={() => void confirmDelete()} disabled={deleting}>
              {deleting && <Spinner size={14} />}
              {t('ask.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  )
}

export default ConversationList
