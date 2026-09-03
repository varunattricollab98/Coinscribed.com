'use client'

import { useCallback, useRef } from 'react'
import { genKey } from '@/lib/portable-text'
import type { EditorTableBlock } from '@/lib/admin-types'

/**
 * Visual, spreadsheet-style table editor - the headline feature of the /admin
 * editor and the direct fix for the user's #1 pain point (authoring tables in
 * Sanity Studio, where each row/cell has to be added through nested array
 * dialogs).
 *
 * It edits an `EditorTableBlock` in place: an editable header row plus editable
 * data rows rendered as a real HTML <table> so it reads like a spreadsheet.
 * Controls: add/remove columns, add/remove rows, move rows up/down, move
 * columns left/right, and an optional caption. Keyboard niceties: Tab walks to
 * the next cell (native), and pressing Enter in a cell on the LAST row appends
 * a new row so long tables can be typed without reaching for the mouse.
 *
 * DEPENDENCY-FREE by design (no spreadsheet library) to keep the admin bundle
 * lean and avoid any React-19-only packages.
 *
 * SERIALIZATION: this component only ever produces a well-formed
 * `EditorTableBlock`. Converting it to the exact Portable Text `tableBlock`
 * shape ({ _type:'tableBlock', caption?, header, rows:[{_type:'row', cells}] })
 * is done by `serializeBlock`/`buildTableBlock` in `lib/portable-text.ts` at
 * save time - this file never re-serializes. The one invariant it guarantees is
 * that `header.length` and every `row.cells.length` stay equal, so the emitted
 * table is always rectangular.
 */

interface TableEditorProps {
  value: EditorTableBlock
  onChange: (next: EditorTableBlock) => void
}

/** Pad or truncate a cells array so it has exactly `length` entries. */
function fitCells(cells: string[], length: number): string[] {
  if (cells.length === length) return cells
  if (cells.length > length) return cells.slice(0, length)
  return [...cells, ...Array(length - cells.length).fill('')]
}

export function TableEditor({ value, onChange }: TableEditorProps) {
  const columnCount = value.header.length

  // Grid of <input> refs keyed by "r:c" (r = -1 for the header row) so Enter on
  // the last data row can move focus into the freshly-added row.
  const cellRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const setCaption = useCallback(
    (caption: string) => {
      const trimmed = caption
      const { caption: _drop, ...rest } = value
      void _drop
      onChange(trimmed ? { ...rest, caption: trimmed } : rest)
    },
    [onChange, value]
  )

  const setHeaderCell = useCallback(
    (col: number, text: string) => {
      const header = value.header.map((h, i) => (i === col ? text : h))
      onChange({ ...value, header })
    },
    [onChange, value]
  )

  const setDataCell = useCallback(
    (rowIndex: number, col: number, text: string) => {
      const rows = value.rows.map((row, i) =>
        i === rowIndex
          ? {
              ...row,
              cells: row.cells.map((c, ci) => (ci === col ? text : c)),
            }
          : row
      )
      onChange({ ...value, rows })
    },
    [onChange, value]
  )

  const addColumn = useCallback(() => {
    const nextLen = columnCount + 1
    onChange({
      ...value,
      header: [...value.header, ''],
      rows: value.rows.map((row) => ({
        ...row,
        cells: fitCells([...row.cells, ''], nextLen),
      })),
    })
  }, [columnCount, onChange, value])

  const removeColumn = useCallback(
    (col: number) => {
      if (columnCount <= 1) return
      onChange({
        ...value,
        header: value.header.filter((_, i) => i !== col),
        rows: value.rows.map((row) => ({
          ...row,
          cells: row.cells.filter((_, i) => i !== col),
        })),
      })
    },
    [columnCount, onChange, value]
  )

  const moveColumn = useCallback(
    (col: number, dir: -1 | 1) => {
      const target = col + dir
      if (target < 0 || target >= columnCount) return
      const swap = <T,>(arr: T[]): T[] => {
        const next = [...arr]
        const [item] = next.splice(col, 1)
        next.splice(target, 0, item)
        return next
      }
      onChange({
        ...value,
        header: swap(value.header),
        rows: value.rows.map((row) => ({ ...row, cells: swap(row.cells) })),
      })
    },
    [columnCount, onChange, value]
  )

  const addRow = useCallback(() => {
    onChange({
      ...value,
      rows: [
        ...value.rows,
        { _key: genKey(), cells: Array(columnCount).fill('') },
      ],
    })
  }, [columnCount, onChange, value])

  const removeRow = useCallback(
    (rowIndex: number) => {
      if (value.rows.length <= 1) return
      onChange({
        ...value,
        rows: value.rows.filter((_, i) => i !== rowIndex),
      })
    },
    [onChange, value]
  )

  const moveRow = useCallback(
    (rowIndex: number, dir: -1 | 1) => {
      const target = rowIndex + dir
      if (target < 0 || target >= value.rows.length) return
      const rows = [...value.rows]
      const [item] = rows.splice(rowIndex, 1)
      rows.splice(target, 0, item)
      onChange({ ...value, rows })
    },
    [onChange, value]
  )

  // Enter on the last row appends a row and focuses the same column in it.
  const handleCellKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      rowIndex: number,
      col: number
    ) => {
      if (e.key !== 'Enter') return
      e.preventDefault()
      if (rowIndex === value.rows.length - 1) {
        addRow()
        // Focus the new cell after React commits the added row.
        requestAnimationFrame(() => {
          cellRefs.current[`${rowIndex + 1}:${col}`]?.focus()
        })
      } else {
        cellRefs.current[`${rowIndex + 1}:${col}`]?.focus()
      }
    },
    [addRow, value.rows.length]
  )

  return (
    <div className="space-y-3">
      {/* Caption */}
      <div>
        <label className="mb-1 block font-sans text-caption text-ink-muted dark:text-ink-inverse-muted">
          Caption (optional)
        </label>
        <input
          type="text"
          value={value.caption ?? ''}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Short description shown above the table"
          className="w-full rounded-sm border border-hairline bg-paper px-3 py-2 font-sans text-sm text-ink focus:border-accent focus:outline-none dark:border-hairline-dark dark:bg-graphite dark:text-ink-inverse"
        />
      </div>

      {/* Grid */}
      <div className="overflow-x-auto rounded-sm border border-hairline dark:border-hairline-dark">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            {/* Column tools row: move left/right + delete, per column. */}
            <tr className="bg-wash dark:bg-elevated">
              <th className="w-8 border-b border-r border-hairline p-1 dark:border-hairline-dark" />
              {value.header.map((_, col) => (
                <th
                  key={`tools-${col}`}
                  className="border-b border-r border-hairline p-1 last:border-r-0 dark:border-hairline-dark"
                >
                  <div className="flex items-center justify-center gap-1">
                    <GridIconButton
                      label={`Move column ${col + 1} left`}
                      onClick={() => moveColumn(col, -1)}
                      disabled={col === 0}
                    >
                      ‹
                    </GridIconButton>
                    <GridIconButton
                      label={`Move column ${col + 1} right`}
                      onClick={() => moveColumn(col, 1)}
                      disabled={col === columnCount - 1}
                    >
                      ›
                    </GridIconButton>
                    <GridIconButton
                      label={`Delete column ${col + 1}`}
                      onClick={() => removeColumn(col)}
                      disabled={columnCount <= 1}
                    >
                      ✕
                    </GridIconButton>
                  </div>
                </th>
              ))}
            </tr>
            {/* Editable header row. */}
            <tr className="bg-wash dark:bg-elevated">
              <th
                scope="col"
                className="border-b border-r border-hairline px-2 py-1 text-center font-sans text-caption font-semibold uppercase tracking-wide text-ink-muted dark:border-hairline-dark dark:text-ink-inverse-muted"
              >
                #
              </th>
              {value.header.map((cell, col) => (
                <th
                  key={`header-${col}`}
                  scope="col"
                  className="border-b border-r border-hairline p-0 last:border-r-0 dark:border-hairline-dark"
                >
                  <input
                    ref={(el) => {
                      cellRefs.current[`-1:${col}`] = el
                    }}
                    type="text"
                    value={cell}
                    onChange={(e) => setHeaderCell(col, e.target.value)}
                    placeholder={`Column ${col + 1}`}
                    aria-label={`Header for column ${col + 1}`}
                    className="w-full min-w-[8rem] bg-transparent px-3 py-2 font-sans text-caption font-semibold uppercase tracking-wide text-ink focus:bg-paper focus:outline-none dark:text-ink-inverse dark:focus:bg-graphite"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {value.rows.map((row, rowIndex) => (
              <tr
                key={row._key}
                className="border-b border-hairline last:border-0 dark:border-hairline-dark"
              >
                {/* Row tools: move up/down + delete. */}
                <td className="border-r border-hairline p-1 align-middle dark:border-hairline-dark">
                  <div className="flex flex-col items-center gap-0.5">
                    <GridIconButton
                      label={`Move row ${rowIndex + 1} up`}
                      onClick={() => moveRow(rowIndex, -1)}
                      disabled={rowIndex === 0}
                    >
                      ↑
                    </GridIconButton>
                    <GridIconButton
                      label={`Move row ${rowIndex + 1} down`}
                      onClick={() => moveRow(rowIndex, 1)}
                      disabled={rowIndex === value.rows.length - 1}
                    >
                      ↓
                    </GridIconButton>
                    <GridIconButton
                      label={`Delete row ${rowIndex + 1}`}
                      onClick={() => removeRow(rowIndex)}
                      disabled={value.rows.length <= 1}
                    >
                      ✕
                    </GridIconButton>
                  </div>
                </td>
                {fitCells(row.cells, columnCount).map((cell, col) => (
                  <td
                    key={`${row._key}-${col}`}
                    className="border-r border-hairline p-0 align-top last:border-r-0 dark:border-hairline-dark"
                  >
                    <input
                      ref={(el) => {
                        cellRefs.current[`${rowIndex}:${col}`] = el
                      }}
                      type="text"
                      value={cell}
                      onChange={(e) => setDataCell(rowIndex, col, e.target.value)}
                      onKeyDown={(e) => handleCellKeyDown(e, rowIndex, col)}
                      aria-label={`Row ${rowIndex + 1}, column ${col + 1}`}
                      className="w-full min-w-[8rem] bg-transparent px-3 py-2 font-sans text-sm leading-relaxed text-ink-body focus:bg-paper focus:outline-none dark:text-ink-inverse-body dark:focus:bg-graphite"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center rounded-sm border border-hairline px-3 py-1.5 font-sans text-caption text-ink-body transition-colors hover:border-accent hover:text-accent dark:border-hairline-dark dark:text-ink-inverse-body dark:hover:border-accent-light dark:hover:text-accent-light"
        >
          + Add row
        </button>
        <button
          type="button"
          onClick={addColumn}
          className="inline-flex items-center rounded-sm border border-hairline px-3 py-1.5 font-sans text-caption text-ink-body transition-colors hover:border-accent hover:text-accent dark:border-hairline-dark dark:text-ink-inverse-body dark:hover:border-accent-light dark:hover:text-accent-light"
        >
          + Add column
        </button>
        <span className="font-sans text-caption text-ink-muted dark:text-ink-inverse-muted">
          {columnCount} column{columnCount === 1 ? '' : 's'} ×{' '}
          {value.rows.length} row{value.rows.length === 1 ? '' : 's'}. Press
          Enter in the last row to add another.
        </span>
      </div>
    </div>
  )
}

function GridIconButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="flex h-5 w-5 items-center justify-center rounded-sm border border-hairline text-caption leading-none text-ink-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-30 dark:border-hairline-dark dark:text-ink-inverse-muted dark:hover:border-accent-light dark:hover:text-accent-light"
    >
      {children}
    </button>
  )
}
