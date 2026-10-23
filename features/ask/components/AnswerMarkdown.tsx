'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const AnswerMarkdown = ({ children }: { children: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      p: ({ children }) => <p className="mb-2 text-sm leading-6 last:mb-0">{children}</p>,
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      ul: ({ children }) => (
        <ul className="mb-2 list-disc space-y-1 pl-5 text-sm leading-6">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="mb-2 list-decimal space-y-1 pl-5 text-sm leading-6">{children}</ol>
      ),
      li: ({ children }) => <li>{children}</li>,
      h1: ({ children }) => <h1 className="mb-2 text-base font-semibold">{children}</h1>,
      h2: ({ children }) => <h2 className="mb-2 text-sm font-semibold">{children}</h2>,
      h3: ({ children }) => <h3 className="mb-1.5 text-sm font-semibold">{children}</h3>,
      code: ({ children }) => (
        <code className="rounded bg-muted px-1 py-0.5 text-xs">{children}</code>
      ),
      table: ({ children }) => (
        <div className="mb-2 overflow-x-auto">
          <table className="w-full border-collapse text-sm">{children}</table>
        </div>
      ),
      th: ({ children }) => (
        <th className="border px-2 py-1 text-left font-semibold">{children}</th>
      ),
      td: ({ children }) => <td className="border px-2 py-1">{children}</td>,
    }}
  >
    {children}
  </ReactMarkdown>
)

export default AnswerMarkdown
