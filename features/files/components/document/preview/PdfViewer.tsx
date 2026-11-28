'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Document, Page, pdfjs } from 'react-pdf'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Minus,
  Plus,
  Search,
} from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const PAGE_GAP = 12
const SIDE_PADDING = 32
const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3]
const DEFAULT_ZOOM_INDEX = 2
const DEFAULT_RATIO = 1.414 // A4 portrait
/** Canvas pixels grow with the square of the DPR; above 2 the cost outweighs the sharpness. */
const MAX_DPR = 2

interface Props {
  blob: Blob
  onError: () => void
}

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!
  )

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const PdfViewer = ({ blob, onError }: Props) => {
  const { t } = useTranslation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const pageTexts = useRef<Map<number, string>>(new Map())

  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  /** height / width of each page at scale 1, so unrendered pages keep their place. */
  const [ratios, setRatios] = useState<number[]>([])
  const [containerWidth, setContainerWidth] = useState(0)
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX)
  /** Text typed in the page box; null while the box just mirrors the current page. */
  const [pageDraft, setPageDraft] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [matches, setMatches] = useState<number[]>([])
  const [matchIndex, setMatchIndex] = useState(0)
  const [searching, setSearching] = useState(false)

  const file = useMemo(() => blob, [blob])
  const numPages = ratios.length
  const zoom = ZOOM_STEPS[zoomIndex]
  const pageWidth = Math.max(200, Math.floor((containerWidth - SIDE_PADDING) * zoom))

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let frame = 0
    const observer = new ResizeObserver(([entry]) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setContainerWidth(Math.round(entry.contentRect.width)))
    })
    observer.observe(el)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  const handleLoad = useCallback(async (doc: PDFDocumentProxy) => {
    pageTexts.current.clear()
    const ratioOf = async (page: number) => {
      const viewport = (await doc.getPage(page)).getViewport({ scale: 1 })
      return viewport.height / viewport.width
    }
    // Show the document as soon as page 1 is measured, assuming every page has its size...
    const first = await ratioOf(1)
    setPdf(doc)
    setRatios(Array(doc.numPages).fill(first))
    // ...then measure the rest in the background, and relayout only if some page differs.
    const rest = await Promise.all(
      Array.from({ length: doc.numPages - 1 }, (_, i) => ratioOf(i + 2))
    )
    if (rest.some((r) => Math.abs(r - first) > 0.001)) setRatios([first, ...rest])
  }, [])

  const devicePixelRatio =
    typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio || 1, MAX_DPR)

  const virtualizer = useVirtualizer({
    count: numPages,
    getScrollElement: () => scrollRef.current,
    estimateSize: (i) => Math.ceil(pageWidth * (ratios[i] ?? DEFAULT_RATIO)) + PAGE_GAP,
    overscan: 3,
  })

  useEffect(() => {
    virtualizer.measure()
  }, [pageWidth, ratios, virtualizer])

  const items = virtualizer.getVirtualItems()
  const scrollOffset = virtualizer.scrollOffset ?? 0
  const currentPage = (items.find((item) => item.end > scrollOffset + PAGE_GAP)?.index ?? 0) + 1

  const goToPage = (page: number) => {
    if (!numPages) return
    const target = Math.min(Math.max(page, 1), numPages)
    virtualizer.scrollToIndex(target - 1, { align: 'start' })
  }

  const getPageText = async (index: number) => {
    const cached = pageTexts.current.get(index)
    if (cached !== undefined || !pdf) return cached ?? ''
    const content = await (await pdf.getPage(index + 1)).getTextContent()
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .toLowerCase()
    pageTexts.current.set(index, text)
    return text
  }

  const runSearch = async () => {
    const q = query.trim()
    setActiveQuery(q)
    setMatchIndex(0)
    if (!q || !pdf) {
      setMatches([])
      return
    }
    setSearching(true)
    try {
      const needle = q.toLowerCase()
      const found: number[] = []
      for (let i = 0; i < numPages; i++) {
        if ((await getPageText(i)).includes(needle)) found.push(i)
      }
      setMatches(found)
      if (found.length) virtualizer.scrollToIndex(found[0], { align: 'start' })
    } finally {
      setSearching(false)
    }
  }

  const stepMatch = (delta: number) => {
    if (!matches.length) return
    const next = (matchIndex + delta + matches.length) % matches.length
    setMatchIndex(next)
    virtualizer.scrollToIndex(matches[next], { align: 'start' })
  }

  const textRenderer = useMemo(() => {
    if (!activeQuery) return undefined
    const pattern = new RegExp(`(${escapeRegExp(activeQuery)})`, 'gi')
    // The text comes from the PDF, so escape it before adding our <mark> tags.
    return ({ str }: { str: string }) =>
      str
        .split(pattern)
        .map((part, i) =>
          i % 2 === 1
            ? `<mark class="rounded-sm bg-yellow-300/70 text-transparent">${escapeHtml(part)}</mark>`
            : escapeHtml(part)
        )
        .join('')
  }, [activeQuery])

  const iconButton =
    'flex size-8 items-center justify-center rounded-md border bg-background hover:bg-accent disabled:opacity-40'

  return (
    <div className="flex h-[80vh] flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={iconButton}
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
            aria-label={t('preview.prev_page')}
          >
            <ChevronLeft className="size-4" />
          </button>
          <input
            value={pageDraft ?? String(currentPage)}
            onChange={(e) => setPageDraft(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return
              if (pageDraft) goToPage(Number(pageDraft))
              setPageDraft(null)
            }}
            onBlur={() => setPageDraft(null)}
            className="h-8 w-12 rounded-md border bg-background text-center"
            inputMode="numeric"
          />
          <span className="text-muted-foreground">/ {numPages || '–'}</span>
          <button
            type="button"
            className={iconButton}
            disabled={currentPage >= numPages}
            onClick={() => goToPage(currentPage + 1)}
            aria-label={t('preview.next_page')}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className={iconButton}
            disabled={zoomIndex === 0}
            onClick={() => setZoomIndex((z) => z - 1)}
            aria-label={t('preview.zoom_out')}
          >
            <Minus className="size-4" />
          </button>
          <button
            type="button"
            className="h-8 min-w-14 rounded-md border bg-background px-2 hover:bg-accent"
            onClick={() => setZoomIndex(DEFAULT_ZOOM_INDEX)}
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            className={iconButton}
            disabled={zoomIndex === ZOOM_STEPS.length - 1}
            onClick={() => setZoomIndex((z) => z + 1)}
            aria-label={t('preview.zoom_in')}
          >
            <Plus className="size-4" />
          </button>
        </div>

        <form
          className="ml-auto flex items-center gap-1"
          onSubmit={(e) => {
            e.preventDefault()
            if (query.trim() === activeQuery && matches.length) stepMatch(1)
            else runSearch()
          }}
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('preview.search_placeholder')}
              className="h-8 w-44 rounded-md border bg-background pl-8 pr-2"
            />
          </div>
          {searching ? (
            <Spinner />
          ) : (
            activeQuery && (
              <span className="min-w-16 text-center text-muted-foreground">
                {matches.length
                  ? t('preview.search_pages', { current: matchIndex + 1, total: matches.length })
                  : t('preview.search_none')}
              </span>
            )
          )}
          <button
            type="button"
            className={iconButton}
            disabled={!matches.length}
            onClick={() => stepMatch(-1)}
            aria-label={t('preview.prev_match')}
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            type="button"
            className={iconButton}
            disabled={!matches.length}
            onClick={() => stepMatch(1)}
            aria-label={t('preview.next_match')}
          >
            <ChevronDown className="size-4" />
          </button>
        </form>
      </div>

      {/* Reserve the scrollbar's space so its appearance doesn't resize (and re-render) every page. */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto rounded-xl border bg-muted/40 [scrollbar-gutter:stable]"
      >
        {/*
          react-pdf v11 suspends by default: every page scrolled into view would suspend up to
          the next/dynamic boundary and hide the whole viewer. Use the loading/error props instead.
        */}
        <Document
          suspense={false}
          file={file}
          onLoadSuccess={handleLoad}
          onLoadError={onError}
          loading={
            <div className="flex h-full items-center justify-center py-20">
              <Spinner />
            </div>
          }
          error={null}
        >
          {pdf && (
            <div
              className="relative mx-auto"
              style={{
                height: virtualizer.getTotalSize(),
                width: Math.max(containerWidth, pageWidth + SIDE_PADDING),
              }}
            >
              {items.map((item) => (
                <div
                  key={item.key}
                  className="absolute left-0 right-0 flex justify-center"
                  style={{ transform: `translateY(${item.start + PAGE_GAP / 2}px)` }}
                >
                  <PdfPage
                    pageNumber={item.index + 1}
                    width={pageWidth}
                    height={Math.ceil(pageWidth * ratios[item.index])}
                    devicePixelRatio={devicePixelRatio}
                    textRenderer={textRenderer}
                  />
                </div>
              ))}
            </div>
          )}
        </Document>
      </div>
    </div>
  )
}

interface PdfPageProps {
  pageNumber: number
  width: number
  height: number
  devicePixelRatio: number
  textRenderer?: (item: { str: string }) => string
}

/**
 * Memoized so scrolling (which re-renders the viewer on every frame) only renders pages that
 * just came into view, instead of re-rendering every mounted page.
 */
const PdfPage = memo(function PdfPage({
  pageNumber,
  width,
  height,
  devicePixelRatio,
  textRenderer,
}: PdfPageProps) {
  return (
    <div className="overflow-hidden bg-white shadow-md" style={{ width, height }}>
      <Page
        pageNumber={pageNumber}
        width={width}
        devicePixelRatio={devicePixelRatio}
        customTextRenderer={textRenderer}
        loading={null}
      />
    </div>
  )
})

export default PdfViewer
