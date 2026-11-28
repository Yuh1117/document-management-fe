'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/** Renders untrusted Markdown: react-markdown does not render raw HTML, so this is XSS-safe. */
const MarkdownViewer = ({ source }: { source: string }) => (
  <div className="h-[80vh] overflow-auto rounded-xl border p-6 text-sm leading-6">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="mb-3 mt-4 text-2xl font-semibold">{children}</h1>,
        h2: ({ children }) => (
          <h2 className="mb-3 mt-4 border-b pb-1 text-xl font-semibold">{children}</h2>
        ),
        h3: ({ children }) => <h3 className="mb-2 mt-3 text-lg font-semibold">{children}</h3>,
        h4: ({ children }) => <h4 className="mb-2 mt-3 font-semibold">{children}</h4>,
        p: ({ children }) => <p className="mb-3">{children}</p>,
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="text-primary underline"
          >
            {children}
          </a>
        ),
        ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-6">{children}</ul>,
        ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-6">{children}</ol>,
        blockquote: ({ children }) => (
          <blockquote className="mb-3 border-l-4 pl-4 text-muted-foreground">{children}</blockquote>
        ),
        pre: ({ children }) => (
          <pre className="mb-3 overflow-x-auto rounded-lg bg-muted p-3 text-xs [&_code]:bg-transparent [&_code]:p-0">
            {children}
          </pre>
        ),
        code: ({ children }) => (
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{children}</code>
        ),
        table: ({ children }) => (
          <div className="mb-3 overflow-x-auto">
            <table className="w-full border-collapse">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border bg-muted px-2 py-1 text-left font-semibold">{children}</th>
        ),
        td: ({ children }) => <td className="border px-2 py-1">{children}</td>,
        img: ({ src, alt }) => (
          <img src={typeof src === 'string' ? src : undefined} alt={alt} className="max-w-full" />
        ),
        hr: () => <hr className="my-4" />,
      }}
    >
      {source}
    </ReactMarkdown>
  </div>
)

export default MarkdownViewer
