'use client'

import { useEffect, useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

interface Props {
  blob: Blob
  alt?: string
  /** TIFF is not rendered by most browsers, so decode it to PNG first. */
  isTiff: boolean
  onError: () => void
}

const ImageViewer = ({ blob, alt, isTiff, onError }: Props) => {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let url: string | null = null
    ;(async () => {
      try {
        const image = isTiff ? await tiffToPng(blob) : blob
        if (cancelled) return
        url = URL.createObjectURL(image)
        setSrc(url)
      } catch {
        if (!cancelled) onError()
      }
    })()
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
      setSrc(null)
    }
  }, [blob, isTiff, onError])

  if (!src) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const buttonClass =
    'flex size-8 items-center justify-center rounded-md border bg-background/90 shadow-sm hover:bg-accent'

  return (
    <div className="relative h-[80vh] overflow-hidden rounded-xl border bg-muted/30">
      <TransformWrapper minScale={0.5} maxScale={10} centerOnInit doubleClick={{ mode: 'toggle' }}>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute right-2 top-2 z-10 flex gap-1">
              <button type="button" className={buttonClass} onClick={() => zoomIn()}>
                <Plus className="size-4" />
              </button>
              <button type="button" className={buttonClass} onClick={() => zoomOut()}>
                <Minus className="size-4" />
              </button>
              <button type="button" className={buttonClass} onClick={() => resetTransform()}>
                <RotateCcw className="size-4" />
              </button>
            </div>
            <TransformComponent
              wrapperClass="!h-full !w-full"
              contentClass="!h-full !w-full flex items-center justify-center"
            >
              <img
                src={src}
                alt={alt}
                onError={onError}
                className="max-h-[80vh] max-w-full object-contain"
                draggable={false}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  )
}

/** Decodes the first page of a TIFF to a PNG blob. */
async function tiffToPng(blob: Blob): Promise<Blob> {
  const UTIF = (await import('utif')).default
  const buffer = await blob.arrayBuffer()
  const ifds = UTIF.decode(buffer)
  if (ifds.length === 0) throw new Error('Empty TIFF')
  UTIF.decodeImage(buffer, ifds[0])
  const rgba = UTIF.toRGBA8(ifds[0])
  const { width, height } = ifds[0]

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  ctx.putImageData(new ImageData(new Uint8ClampedArray(rgba), width, height), 0, 0)

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (png) => (png ? resolve(png) : reject(new Error('PNG encode failed'))),
      'image/png'
    )
  )
}

export default ImageViewer
