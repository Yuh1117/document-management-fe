'use client'

import { useEffect, useState } from 'react'

interface Props {
  blob: Blob
  kind: 'video' | 'audio'
  onError: () => void
}

/** Plays a blob with the browser's native video / audio player. */
const BlobMediaViewer = ({ blob, kind, onError }: Props) => {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    const objectUrl = URL.createObjectURL(blob)
    setUrl(objectUrl)
    return () => {
      URL.revokeObjectURL(objectUrl)
      setUrl(null)
    }
  }, [blob])

  if (!url) return null

  if (kind === 'video') {
    return (
      <video
        controls
        src={url}
        onError={onError}
        className="h-[80vh] w-full rounded-xl bg-black shadow-md"
      />
    )
  }
  return (
    <div className="flex h-[30vh] items-center justify-center">
      <audio controls src={url} onError={onError} className="w-full" />
    </div>
  )
}

export default BlobMediaViewer
