export type PreviewKind =
  | 'pdf'
  | 'docx'
  | 'spreadsheet'
  | 'image'
  | 'tiff'
  | 'video'
  | 'audio'
  | 'markdown'
  | 'code'
  | 'text'
  | 'unsupported'

export const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

const SPREADSHEET_MIMES = new Set([
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.oasis.opendocument.spreadsheet',
  'text/csv',
  'text/tab-separated-values',
])

/** File extension -> Shiki language id. */
const CODE_LANGS: Record<string, string> = {
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  json: 'json',
  html: 'html',
  htm: 'html',
  css: 'css',
  scss: 'scss',
  xml: 'xml',
  yml: 'yaml',
  yaml: 'yaml',
  py: 'python',
  java: 'java',
  kt: 'kotlin',
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  cs: 'csharp',
  go: 'go',
  rs: 'rust',
  php: 'php',
  rb: 'ruby',
  sql: 'sql',
  sh: 'bash',
  bash: 'bash',
  ps1: 'powershell',
  dockerfile: 'docker',
  ini: 'ini',
  toml: 'toml',
  properties: 'properties',
}

const CODE_MIMES: Record<string, string> = {
  'application/json': 'json',
  'text/html': 'html',
  'text/css': 'css',
  'text/xml': 'xml',
  'application/xml': 'xml',
  'text/javascript': 'javascript',
  'application/javascript': 'javascript',
  'application/x-yaml': 'yaml',
  'text/x-python': 'python',
  'text/x-java-source': 'java',
  'application/sql': 'sql',
}

export const normalizeMime = (mime?: string | null) =>
  (mime ?? '').split(';')[0].trim().toLowerCase()

export const extensionOf = (name?: string | null) => {
  const dot = name?.lastIndexOf('.') ?? -1
  return name && dot >= 0 ? name.slice(dot + 1).toLowerCase() : ''
}

export function codeLanguageOf(mime: string, name?: string | null): string | null {
  return CODE_LANGS[extensionOf(name)] ?? CODE_MIMES[mime] ?? null
}

export function previewKindOf(rawMime?: string | null, name?: string | null): PreviewKind {
  const mime = normalizeMime(rawMime)
  const ext = extensionOf(name)

  if (mime === 'application/pdf') return 'pdf'
  if (mime === DOCX_MIME) return 'docx'
  if (SPREADSHEET_MIMES.has(mime) || ext === 'csv' || ext === 'tsv') return 'spreadsheet'
  if (mime === 'image/tiff') return 'tiff'
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('audio/')) return 'audio'
  if (mime === 'text/markdown' || ext === 'md' || ext === 'markdown') return 'markdown'
  if (codeLanguageOf(mime, name)) return 'code'
  if (mime.startsWith('text/')) return 'text'
  return 'unsupported'
}
