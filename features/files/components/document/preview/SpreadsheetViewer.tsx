'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { WorkBook, WorkSheet } from 'xlsx'
import { Spinner } from '@/components/ui/spinner'

const ROW_HEIGHT = 28
const MAX_ROWS = 50_000
const MAX_COLS = 500

interface Props {
  blob: Blob
  /** CSV/TSV: decode as UTF-8 text first so Vietnamese characters survive. */
  isText: boolean
  onError: () => void
}

type Utils = typeof import('xlsx').utils

interface Merge {
  rowSpan: number
  colSpan: number
}

interface Grid {
  values: string[][]
  colCount: number
  colOffset: number
  rowOffset: number
  /** "r:c" of a merge's top-left cell -> its span. */
  origins: Map<string, Merge>
  /** "r:c" of every cell a merge covers (except the origin) -> origin coordinates. */
  covered: Map<string, [number, number]>
  totalRows: number
  truncated: boolean
}

const SpreadsheetViewer = ({ blob, isText, onError }: Props) => {
  const [book, setBook] = useState<{ workbook: WorkBook; utils: Utils } | null>(null)
  const [activeSheet, setActiveSheet] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const XLSX = await import('xlsx')
        const workbook = isText
          ? XLSX.read(await blob.text(), { type: 'string', dense: true })
          : XLSX.read(await blob.arrayBuffer(), { type: 'array', dense: true })
        if (cancelled) return
        setBook({ workbook, utils: XLSX.utils })
        setActiveSheet(workbook.SheetNames[0] ?? '')
      } catch {
        if (!cancelled) onError()
      }
    })()
    return () => {
      cancelled = true
    }
  }, [blob, isText, onError])

  if (!book) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex h-[80vh] flex-col">
      {book.workbook.SheetNames.length > 1 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {book.workbook.SheetNames.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setActiveSheet(name)}
              className={`rounded border px-3 py-1 text-sm ${
                activeSheet === name
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-accent'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
      <SheetGrid key={activeSheet} sheet={book.workbook.Sheets[activeSheet]} utils={book.utils} />
    </div>
  )
}

const SheetGrid = ({ sheet, utils }: { sheet: WorkSheet | undefined; utils: Utils }) => {
  const { t } = useTranslation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const grid = useMemo(() => buildGrid(sheet, utils), [sheet, utils])

  const virtualizer = useVirtualizer({
    count: grid?.values.length ?? 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
  })

  if (!grid || grid.values.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-xl border text-muted-foreground">
        {t('preview.no_data')}
      </div>
    )
  }

  const items = virtualizer.getVirtualItems()
  const first = items[0]?.index ?? 0
  const last = items[items.length - 1]?.index ?? 0
  const padTop = items[0]?.start ?? 0
  const padBottom = virtualizer.getTotalSize() - (items[items.length - 1]?.end ?? 0)
  const columns = Array.from({ length: grid.colCount }, (_, c) => c)

  const renderCell = (r: number, c: number) => {
    const key = `${r}:${c}`
    const cellClass =
      'max-w-[24rem] overflow-hidden text-ellipsis whitespace-nowrap border border-gray-300 px-2 align-top'
    const origin = grid.origins.get(key)
    if (origin) {
      return (
        <td
          key={c}
          rowSpan={Math.min(r + origin.rowSpan - 1, last) - r + 1}
          colSpan={origin.colSpan}
          className={cellClass}
          title={grid.values[r][c]}
        >
          {grid.values[r][c]}
        </td>
      )
    }
    const coveredBy = grid.covered.get(key)
    if (coveredBy) {
      // The merge started above the rendered window: draw what is left of it on the first visible row.
      const [or, oc] = coveredBy
      if (r === first && or < first && c === oc) {
        const span = grid.origins.get(`${or}:${oc}`)!
        return (
          <td
            key={c}
            rowSpan={Math.min(or + span.rowSpan - 1, last) - r + 1}
            colSpan={span.colSpan}
            className={cellClass}
          >
            {grid.values[or][oc]}
          </td>
        )
      }
      return null
    }
    return (
      <td key={c} className={cellClass} title={grid.values[r][c] || undefined}>
        {grid.values[r][c]}
      </td>
    )
  }

  return (
    <>
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto rounded-xl border bg-white text-sm text-black"
      >
        <table className="border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-gray-100">
            <tr style={{ height: ROW_HEIGHT }}>
              <th className="sticky left-0 z-20 min-w-10 border border-gray-300 bg-gray-100" />
              {columns.map((c) => (
                <th
                  key={c}
                  className="min-w-20 border border-gray-300 px-2 font-medium text-gray-600"
                >
                  {utils.encode_col(c + grid.colOffset)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {padTop > 0 && (
              <tr style={{ height: padTop }}>
                <td colSpan={grid.colCount + 1} />
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.index} style={{ height: ROW_HEIGHT }}>
                <th className="sticky left-0 border border-gray-300 bg-gray-100 px-2 text-right font-medium text-gray-600">
                  {item.index + grid.rowOffset + 1}
                </th>
                {columns.map((c) => renderCell(item.index, c))}
              </tr>
            ))}
            {padBottom > 0 && (
              <tr style={{ height: padBottom }}>
                <td colSpan={grid.colCount + 1} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {grid.truncated && (
        <p className="mt-2 text-xs text-muted-foreground">
          {t('preview.rows_truncated', { shown: MAX_ROWS, total: grid.totalRows })}
        </p>
      )}
    </>
  )
}

function buildGrid(sheet: WorkSheet | undefined, utils: Utils): Grid | null {
  if (!sheet || !sheet['!ref']) return null

  const range = utils.decode_range(sheet['!ref'])
  const totalRows = range.e.r - range.s.r + 1
  const truncated = totalRows > MAX_ROWS
  const limited = {
    s: range.s,
    e: {
      r: Math.min(range.e.r, range.s.r + MAX_ROWS - 1),
      c: Math.min(range.e.c, range.s.c + MAX_COLS - 1),
    },
  }
  const colCount = limited.e.c - limited.s.c + 1

  const rows = utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    raw: false,
    defval: '',
    blankrows: true,
    range: limited,
  })
  const values = rows.map((row) => Array.from({ length: colCount }, (_, c) => String(row[c] ?? '')))

  const origins = new Map<string, Merge>()
  const covered = new Map<string, [number, number]>()
  for (const m of sheet['!merges'] ?? []) {
    const r0 = m.s.r - limited.s.r
    const c0 = m.s.c - limited.s.c
    const r1 = Math.min(m.e.r - limited.s.r, values.length - 1)
    const c1 = Math.min(m.e.c - limited.s.c, colCount - 1)
    if (r0 < 0 || c0 < 0 || r0 >= values.length || c0 >= colCount) continue
    origins.set(`${r0}:${c0}`, { rowSpan: r1 - r0 + 1, colSpan: c1 - c0 + 1 })
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        if (r !== r0 || c !== c0) covered.set(`${r}:${c}`, [r0, c0])
      }
    }
  }

  return {
    values,
    colCount,
    colOffset: limited.s.c,
    rowOffset: limited.s.r,
    origins,
    covered,
    totalRows,
    truncated,
  }
}

export default SpreadsheetViewer
