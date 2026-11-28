'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { IDocument } from '@/types/type'
import api, { endpoints } from '@/lib/api'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@/components/ui/spinner'
import dynamic from 'next/dynamic'
import { codeLanguageOf, extensionOf, normalizeMime, previewKindOf } from './preview/previewKind'
import BlobMediaViewer from './preview/BlobMediaViewer'

// Each viewer pulls in a heavy library; load it only when that file type is opened.
const SpreadsheetViewer = dynamic(() => import('./preview/SpreadsheetViewer'), { ssr: false })
const ImageViewer = dynamic(() => import('./preview/ImageViewer'), { ssr: false })
const DocxViewer = dynamic(() => import('./preview/DocxViewer'), { ssr: false })
const PdfViewer = dynamic(() => import('./preview/PdfViewer'), { ssr: false })
const CodeViewer = dynamic(() => import('./preview/CodeViewer'), { ssr: false })
const MarkdownViewer = dynamic(() => import('./preview/MarkdownViewer'), { ssr: false })

interface Props {
  data: IDocument | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type View =
  | { view: 'pdf' | 'video' | 'audio' | 'docx' | 'spreadsheet' | 'image' | 'tiff'; blob: Blob }
  | { view: 'markdown' | 'text'; text: string }
  | { view: 'code'; text: string; lang: string }

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'unsupported' }
  | ({ status: 'ready' } & View)

const fetchBlob = async (url: string, signal: AbortSignal) =>
  (await api.get<Blob>(url, { responseType: 'blob', signal })).data

const decodeUtf8 = async (blob: Blob) => new TextDecoder('utf-8').decode(await blob.arrayBuffer())

const DocumentPreviewModal = ({ data, open, onOpenChange }: Props) => {
  const { t } = useTranslation()
  const [state, setState] = useState<State>({ status: 'idle' })

  const documentId = data?.id
  const mime = normalizeMime(data?.mimeType)
  const name = data?.name
  const kind = previewKindOf(mime, name)

  useEffect(() => {
    if (!open || !documentId) return
    if (kind === 'unsupported') {
      setState({ status: 'unsupported' })
      return
    }

    const controller = new AbortController()
    const { signal } = controller
    let cancelled = false

    const load = async (): Promise<View> => {
      const blob = await fetchBlob(endpoints['document-preview'](documentId), signal)
      switch (kind) {
        case 'markdown':
        case 'text':
          return { view: kind, text: await decodeUtf8(blob) }
        case 'code':
          return {
            view: 'code',
            text: await decodeUtf8(blob),
            lang: codeLanguageOf(mime, name) ?? 'text',
          }
        default:
          return { view: kind, blob }
      }
    }

    setState({ status: 'loading' })
    load()
      .then((view) => !cancelled && setState({ status: 'ready', ...view }))
      .catch(() => !cancelled && setState({ status: 'error' }))

    return () => {
      cancelled = true
      controller.abort()
      setState({ status: 'idle' })
    }
  }, [open, documentId, kind, mime, name])

  const handleViewerError = useCallback(() => setState({ status: 'error' }), [])

  const message = (text: string) => (
    <div className="flex h-[60vh] items-center justify-center text-center text-muted-foreground">
      {text}
    </div>
  )

  const renderContent = () => {
    switch (state.status) {
      case 'idle':
      case 'loading':
        // Same height as the viewers, so the dialog doesn't jump when the content arrives.
        return (
          <div className="flex h-[80vh] items-center justify-center">
            <Spinner />
          </div>
        )
      case 'error':
        return message(t('preview.error'))
      case 'unsupported':
        return message(t('preview.unsupported'))
    }

    switch (state.view) {
      case 'pdf':
        return <PdfViewer blob={state.blob} onError={handleViewerError} />
      case 'video':
      case 'audio':
        return <BlobMediaViewer blob={state.blob} kind={state.view} onError={handleViewerError} />
      case 'docx':
        return <DocxViewer blob={state.blob} onError={handleViewerError} />
      case 'spreadsheet': {
        const ext = extensionOf(name)
        const isText = mime.startsWith('text/') || ext === 'csv' || ext === 'tsv'
        return <SpreadsheetViewer blob={state.blob} isText={isText} onError={handleViewerError} />
      }
      case 'image':
      case 'tiff':
        return (
          <ImageViewer
            blob={state.blob}
            alt={name}
            isTiff={state.view === 'tiff'}
            onError={handleViewerError}
          />
        )
      case 'markdown':
        return <MarkdownViewer source={state.text} />
      case 'code':
        return <CodeViewer code={state.text} lang={state.lang} />
      case 'text':
        return (
          <pre className="h-[80vh] overflow-auto whitespace-pre-wrap break-words rounded-xl border bg-muted/30 p-4 font-mono text-sm">
            {state.text}
          </pre>
        )
    }
  }

  const isWide = kind !== 'audio' && kind !== 'unsupported'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`flex w-full flex-col ${isWide ? 'sm:max-w-5xl' : 'sm:max-w-2xl'}`}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="truncate pr-6">{name}</DialogTitle>
        </DialogHeader>
        <div className="mt-2 flex-1">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  )
}

export default DocumentPreviewModal
