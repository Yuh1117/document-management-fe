'use client'

import { useEffect, useRef, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

interface Props {
  blob: Blob
  onError: () => void
}

/** Client-side DOCX rendering, used only when the backend PDF rendition is unavailable. */
const DocxViewer = ({ blob, onError }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let cancelled = false
    ;(async () => {
      try {
        const { renderAsync } = await import('docx-preview')
        if (cancelled) return
        container.innerHTML = ''
        await renderAsync(blob, container, undefined, { inWrapper: false, ignoreWidth: true })
        if (!cancelled) setRendered(true)
      } catch {
        if (!cancelled) onError()
      }
    })()
    return () => {
      cancelled = true
      container.innerHTML = ''
      setRendered(false)
    }
  }, [blob, onError])

  return (
    <div className="relative h-[80vh]">
      {!rendered && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-auto rounded-xl border bg-white p-6 text-black"
      />
    </div>
  )
}

export default DocxViewer
