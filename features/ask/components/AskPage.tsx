'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { History, MessageSquareText, Plus, SendHorizontal, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import api, { endpoints } from '@/lib/api'
import { useDocumentStore } from '@/store/documentStore'
import DocumentPreviewModal from '@/features/files/components/document/DocumentPreviewModal'
import AnswerMarkdown from '@/features/ask/components/AnswerMarkdown'
import ConversationList from '@/features/ask/components/ConversationList'
import { AskHttpError, streamAsk } from '@/features/ask/lib/streamAsk'
import { mimeTypeFromName } from '@/features/ask/lib/mimeFromName'
import { getIconComponentByMimeType } from '@/lib/fileIcons'
import type {
  IChatConversation,
  IChatMessage,
  IChatMessagePage,
  IDocument,
  IRagSource,
} from '@/types/type'

type AnswerStatus = 'searching' | 'answering' | 'done' | 'error' | 'stopped'

interface ChatMessage {
  id: number
  /** Backend id; only set for messages loaded from history. */
  serverId?: string
  role: 'user' | 'assistant'
  content: string
  sources?: IRagSource[]
  status?: AnswerStatus
  model?: string | null
  error?: string | null
}

const MAX_QUESTION_LENGTH = 500
const MESSAGE_PAGE_SIZE = 30

interface SourceGroup {
  documentId: string
  name: string | null
  indexes: number[]
  snippet: string
}

const SourceFileIcon = ({ name }: { name: string | null }) => {
  const { icon: Icon, color } = getIconComponentByMimeType(mimeTypeFromName(name))
  return <Icon size={20} color={color} className="shrink-0" />
}

const groupSources = (sources: IRagSource[]): SourceGroup[] => {
  const groups = new Map<string, SourceGroup>()
  for (const s of sources) {
    const group = groups.get(s.document_id)
    if (group) {
      group.indexes.push(s.index)
    } else {
      groups.set(s.document_id, {
        documentId: s.document_id,
        name: s.name,
        indexes: [s.index],
        snippet: s.snippet,
      })
    }
  }
  return [...groups.values()]
}

const AskPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const nextId = useRef(1)
  const bottomRef = useRef<HTMLDivElement>(null)

  const [conversations, setConversations] = useState<IChatConversation[]>([])
  const [conversationsLoading, setConversationsLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeIdRef = useRef<string | null>(null)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [hasOlder, setHasOlder] = useState(false)
  const [loadingOlder, setLoadingOlder] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const topSentinelRef = useRef<HTMLDivElement>(null)
  /** Scroll distance from the bottom, kept while older messages are prepended. */
  const restoreFromBottomRef = useRef<number | null>(null)

  const searchParams = useSearchParams()
  const urlId = searchParams.get('id')

  const changeActive = (id: string | null) => {
    activeIdRef.current = id
    setActiveId(id)
  }

  const loadConversations = useCallback(async () => {
    try {
      const res = await api.get(endpoints['rag-conversations'])
      setConversations(res.data.data as IChatConversation[])
    } catch (err) {
      console.error('Failed to load conversations', err)
    } finally {
      setConversationsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadConversations()
  }, [loadConversations])

  const previewModal = useDocumentStore((s) => s.previewModal)
  const openPreviewModal = useDocumentStore((s) => s.openPreviewModal)
  const closePreviewModal = useDocumentStore((s) => s.closePreviewModal)

  const getViewport = () =>
    bottomRef.current?.closest<HTMLElement>('[data-slot=scroll-area-viewport]') ?? null

  useLayoutEffect(() => {
    const viewport = getViewport()
    if (restoreFromBottomRef.current !== null && viewport) {
      // Older messages were prepended: keep the same messages in view.
      viewport.scrollTop = viewport.scrollHeight - restoreFromBottomRef.current
      restoreFromBottomRef.current = null
      return
    }
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  useEffect(() => () => abortRef.current?.abort(), [])

  const toChatMessage = (m: IChatMessage): ChatMessage => ({
    id: nextId.current++,
    serverId: m.id,
    role: m.role,
    content: m.content,
    sources: m.sources ?? undefined,
    status: m.role === 'assistant' ? (m.status ?? 'error') : undefined,
    model: m.model,
  })

  const fetchMessagePage = async (id: string, before?: string) => {
    const res = await api.get(endpoints['rag-conversation-messages'](id), {
      params: { limit: MESSAGE_PAGE_SIZE, ...(before ? { before } : {}) },
    })
    return res.data.data as IChatMessagePage
  }

  const loadConversation = async (id: string) => {
    abortRef.current?.abort()
    changeActive(id)
    setMessages([])
    setHasOlder(false)
    setMessagesLoading(true)
    try {
      const page = await fetchMessagePage(id)
      if (activeIdRef.current !== id) return
      setMessages(page.messages.map(toChatMessage))
      setHasOlder(page.hasMore)
    } catch {
      if (activeIdRef.current === id) toast.error(t('ask.load_failed'))
    } finally {
      if (activeIdRef.current === id) setMessagesLoading(false)
    }
  }

  const loadOlder = async () => {
    const id = activeIdRef.current
    const oldest = messages.find((m) => m.serverId)?.serverId
    if (!id || !oldest || loadingOlder || !hasOlder) return
    setLoadingOlder(true)
    try {
      const page = await fetchMessagePage(id, oldest)
      if (activeIdRef.current !== id) return
      const viewport = getViewport()
      if (viewport) restoreFromBottomRef.current = viewport.scrollHeight - viewport.scrollTop
      setMessages((prev) => [...page.messages.map(toChatMessage), ...prev])
      setHasOlder(page.hasMore)
    } catch {
      toast.error(t('ask.load_failed'))
    } finally {
      setLoadingOlder(false)
    }
  }

  // Load older messages when the top of the list scrolls into view.
  const loadOlderRef = useRef(loadOlder)
  useEffect(() => {
    loadOlderRef.current = loadOlder
  })
  useEffect(() => {
    const sentinel = topSentinelRef.current
    const viewport = getViewport()
    if (!sentinel || !viewport || !hasOlder || messagesLoading) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadOlderRef.current()
      },
      { root: viewport, rootMargin: '200px 0px 0px 0px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasOlder, messagesLoading])

  // The URL (?id=) decides which conversation is open, so reload,
  // back/forward and shared links all land on the right chat.
  useEffect(() => {
    if (urlId === activeIdRef.current) return
    if (urlId) void loadConversation(urlId)
    else if (activeIdRef.current) reset()
  }, [urlId])

  const selectConversation = (id: string) => {
    setHistoryOpen(false)
    if (id !== activeIdRef.current) router.push(`/ask?id=${id}`)
  }

  const startNewChat = () => {
    setHistoryOpen(false)
    if (activeIdRef.current) router.push('/ask')
    else reset()
  }

  const renameConversation = async (id: string, title: string) => {
    try {
      const res = await api.patch(endpoints['rag-conversation-detail'](id), { title })
      const updated = res.data.data as IChatConversation
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: updated.title } : c))
      )
    } catch {
      toast.error(t('ask.rename_failed'))
    }
  }

  const deleteConversation = async (id: string) => {
    try {
      await api.delete(endpoints['rag-conversation-detail'](id))
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (activeIdRef.current === id) router.replace('/ask')
    } catch {
      toast.error(t('ask.delete_failed'))
    }
  }

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q')?.trim()
    if (!q) return
    const timer = setTimeout(() => {
      router.replace('/ask')
      void send(q.slice(0, MAX_QUESTION_LENGTH))
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const updateMessage = (id: number, patch: (m: ChatMessage) => Partial<ChatMessage>) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch(m) } : m)))

  const send = async (override?: string) => {
    const question = (override ?? input).trim()
    if (!question || streaming) return

    const answerId = nextId.current + 1
    nextId.current += 2
    setMessages((prev) => [
      ...prev,
      { id: answerId - 1, role: 'user', content: question },
      { id: answerId, role: 'assistant', content: '', status: 'searching' },
    ])
    setInput('')
    setStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      await streamAsk(
        question,
        activeIdRef.current,
        {
          onConversation: ({ id, title }) => {
            if (activeIdRef.current !== id) {
              changeActive(id)
              router.replace(`/ask?id=${id}`)
            }
            setConversations((prev) => {
              const existing = prev.find((c) => c.id === id)
              const now = new Date().toISOString()
              const moved = existing
                ? { ...existing, updatedAt: now }
                : { id, title, createdAt: now, updatedAt: now }
              return [moved, ...prev.filter((c) => c.id !== id)]
            })
          },
          onSources: (sources) => updateMessage(answerId, () => ({ sources, status: 'answering' })),
          onToken: (text) =>
            updateMessage(answerId, (m) => ({ content: m.content + text, status: 'answering' })),
          onDone: (model) => updateMessage(answerId, () => ({ status: 'done', model })),
          onError: (message) =>
            updateMessage(answerId, () => ({ status: 'error', error: message })),
        },
        controller.signal
      )
      updateMessage(answerId, (m) =>
        m.status === 'searching' || m.status === 'answering' ? { status: 'error' } : {}
      )
    } catch (err) {
      if (controller.signal.aborted) {
        updateMessage(answerId, () => ({ status: 'stopped' }))
      } else {
        console.error('Ask failed', err)
        const unauthorized = err instanceof AskHttpError && err.status === 401
        updateMessage(answerId, () => ({
          status: 'error',
          error: unauthorized ? t('ask.session_expired') : null,
        }))
      }
    } finally {
      abortRef.current = null
      setStreaming(false)
    }
  }

  const stop = () => abortRef.current?.abort()

  const reset = () => {
    abortRef.current?.abort()
    changeActive(null)
    setMessagesLoading(false)
    setHasOlder(false)
    setMessages([])
  }

  const openSource = async (documentId: string) => {
    try {
      const res = await api.get(endpoints['document-detail'](documentId))
      openPreviewModal(res.data.data as IDocument)
    } catch {
      toast.error(t('ask.open_source_failed'))
    }
  }

  const conversationListProps = {
    conversations,
    loading: conversationsLoading,
    activeId,
    onSelect: selectConversation,
    onNew: startNewChat,
    onRename: renameConversation,
    onDelete: deleteConversation,
  }

  return (
    <div className="bg-muted flex h-[calc(100dvh-4.5rem)] flex-col rounded-xl p-2">
      <div className="bg-muted/60 mb-2 flex items-center justify-between rounded-xl border-b p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-semibold">{t('ask.title')}</h1>
        </div>
        <div className="flex items-center gap-1 md:hidden">
          <Button variant="ghost" size="sm" onClick={() => setHistoryOpen(true)}>
            <History className="size-4" />
            {t('ask.history')}
          </Button>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={startNewChat}
              aria-label={t('ask.new_chat')}
            >
              <Plus className="size-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-2">
        <ConversationList
          className="hidden w-64 shrink-0 rounded-xl bg-background/40 md:flex"
          {...conversationListProps}
        />

        <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
          <SheetContent side="left" className="gap-0 p-0" aria-describedby={undefined}>
            <SheetHeader className="pb-0">
              <SheetTitle>{t('ask.history')}</SheetTitle>
            </SheetHeader>
            <ConversationList className="min-h-0 flex-1" {...conversationListProps} />
          </SheetContent>
        </Sheet>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <ScrollArea className="min-h-0 w-full flex-1 [&>[data-slot=scroll-area-viewport]>div]:!block [&>[data-slot=scroll-area-viewport]>div]:h-full">
            <div className="mx-auto h-full w-full max-w-5xl space-y-4 p-3">
              <div ref={topSentinelRef} />
              {loadingOlder && (
                <div className="flex justify-center">
                  <Spinner size={16} />
                </div>
              )}

              {messagesLoading && (
                <div className="flex h-full items-center justify-center">
                  <Spinner size={20} />
                </div>
              )}

              {messages.length === 0 && !messagesLoading && (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                  <MessageSquareText className="size-8" />
                  <p className="text-sm font-medium text-foreground">{t('ask.empty_title')}</p>
                  <p className="max-w-sm text-xs">{t('ask.empty_hint')}</p>
                </div>
              )}

              {messages.map((m) =>
                m.role === 'user' ? (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="flex flex-col items-start gap-2">
                    <div className="max-w-[95%] px-1 py-2">
                      {m.status === 'searching' && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Spinner size={14} />
                          {t('ask.searching')}
                        </div>
                      )}
                      {m.content && <AnswerMarkdown>{m.content}</AnswerMarkdown>}
                      {m.status === 'answering' && !m.content && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Spinner size={14} />
                          {t('ask.answering')}
                        </div>
                      )}
                      {m.status === 'stopped' && (
                        <p className="text-xs text-muted-foreground">{t('ask.stopped')}</p>
                      )}
                      {m.status === 'error' && (
                        <p className="text-sm text-destructive">{m.error || t('ask.error')}</p>
                      )}
                    </div>

                    {m.sources && m.sources.length > 0 && (
                      <div className="w-full max-w-[95%] space-y-1">
                        <p className="text-xs text-muted-foreground">{t('ask.sources')}</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {groupSources(m.sources).map((g) => (
                            <button
                              key={g.documentId}
                              type="button"
                              onClick={() => openSource(g.documentId)}
                              title={t('ask.open_source')}
                              className="flex cursor-pointer flex-col gap-1.5 rounded-xl border bg-background/50 p-3 text-left transition hover:bg-accent hover:shadow-sm"
                            >
                              <span className="flex min-w-0 items-center gap-2">
                                <SourceFileIcon name={g.name} />
                                <span className="truncate text-sm font-medium">
                                  {g.name ?? g.documentId}
                                </span>
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({t('ask.chunks', { count: g.indexes.length })})
                              </span>
                              <span className="line-clamp-2 text-xs text-muted-foreground">
                                {g.snippet}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {m.status === 'done' && m.model && (
                      <p className="text-xs text-muted-foreground">
                        {t('document.summary_model', { name: m.model })}
                      </p>
                    )}
                  </div>
                )
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <div className="mx-auto mt-2 w-full max-w-5xl space-y-1 px-3">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault()
                    void send()
                  }
                }}
                maxLength={MAX_QUESTION_LENGTH}
                rows={2}
                placeholder={t('ask.placeholder')}
                className="min-h-0 resize-none text-sm"
              />
              {streaming ? (
                <Button type="button" variant="outline" onClick={stop} aria-label={t('ask.stop')}>
                  <Square className="size-4" />
                  {t('ask.stop')}
                </Button>
              ) : (
                <Button type="button" onClick={() => void send()} disabled={!input.trim()}>
                  <SendHorizontal className="size-4" />
                  {t('ask.send')}
                </Button>
              )}
            </div>
            <p className="text-center text-[11px] text-muted-foreground">{t('ask.disclaimer')}</p>
          </div>
        </div>
      </div>

      <DocumentPreviewModal
        data={previewModal.data}
        open={previewModal.open}
        onOpenChange={(open) => !open && closePreviewModal()}
      />
    </div>
  )
}

export default AskPage
