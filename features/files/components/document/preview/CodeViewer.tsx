'use client'

import { useEffect, useState } from 'react'

/** Larger files are shown without highlighting so the tab stays responsive. */
const MAX_HIGHLIGHT_CHARS = 300_000

interface Props {
  code: string
  lang: string
}

const CodeViewer = ({ code, lang }: Props) => {
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    if (code.length > MAX_HIGHLIGHT_CHARS) return
    let cancelled = false
    ;(async () => {
      try {
        const { codeToHtml } = await import('shiki')
        const out = await codeToHtml(code, {
          lang,
          themes: { light: 'github-light', dark: 'github-dark' },
          defaultColor: 'light',
        })
        if (!cancelled) setHtml(out)
      } catch {
        // Unknown language or grammar failed to load: keep the plain-text view.
      }
    })()
    return () => {
      cancelled = true
      setHtml(null)
    }
  }, [code, lang])

  const boxClass =
    'h-[80vh] overflow-auto rounded-xl border text-sm [&_pre]:min-h-full [&_pre]:p-4 [&_code]:font-mono'

  if (html) {
    // Shiki escapes the source text; the markup is only its own token spans.
    return <div className={boxClass} dangerouslySetInnerHTML={{ __html: html }} />
  }

  return (
    <div className={boxClass}>
      <pre className="whitespace-pre bg-muted/30">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default CodeViewer
