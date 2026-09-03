'use client'

import { useEffect, useState } from 'react'
import { getAdminClient } from '@/lib/sanity-admin'
import type { SanityReference } from '@/lib/admin-types'

/**
 * A single selectable option (an author or category document reduced to its id
 * and a human label).
 */
interface ReferenceOption {
  _id: string
  label: string
}

interface ReferencePickerProps {
  /** Field label shown above the select. */
  label: string
  /**
   * Which document type to pick. `author` lists `*[_type=='author']` ordered by
   * name; `category` lists `*[_type=='category']` ordered by title.
   */
  kind: 'author' | 'category'
  /** Currently selected reference, or undefined when nothing is chosen. */
  value?: SanityReference
  /** Called with the new reference (or undefined when cleared). */
  onChange: (ref: SanityReference | undefined) => void
  /** Whether the field is required (drives the inline error styling). */
  required?: boolean
  /** Inline validation error to display. */
  error?: string
}

const QUERIES: Record<ReferencePickerProps['kind'], string> = {
  author: `*[_type=='author']|order(name asc){_id, "label": name}`,
  category: `*[_type=='category']|order(title asc){_id, "label": title}`,
}

/**
 * Author / category picker.
 *
 * Fetches the available documents with the authenticated admin client and
 * stores the selection as a Sanity reference object
 * `{ _type: 'reference', _ref: <_id> }`, matching the `author`/`category`
 * reference fields in `sanity/schemas/article.ts`.
 *
 * When no documents of the given type exist yet, it shows a hint that they must
 * be created in the Studio first (there is no admin screen for authors /
 * categories in this feature).
 */
export function ReferencePicker({
  label,
  kind,
  value,
  onChange,
  required,
  error,
}: ReferencePickerProps) {
  const [options, setOptions] = useState<ReferenceOption[] | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let active = true
    getAdminClient()
      .fetch<ReferenceOption[]>(QUERIES[kind])
      .then((result) => {
        if (!active) return
        setOptions(Array.isArray(result) ? result : [])
      })
      .catch(() => {
        if (!active) return
        setLoadError(true)
        setOptions([])
      })
    return () => {
      active = false
    }
  }, [kind])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    onChange(id ? { _type: 'reference', _ref: id } : undefined)
  }

  const isEmpty = options !== null && options.length === 0
  const typeLabel = kind === 'author' ? 'author' : 'category'

  return (
    <div>
      <label className="mb-1.5 block font-sans text-caption font-semibold uppercase tracking-wide text-ink-muted dark:text-ink-inverse-muted">
        {label}
        {required && <span className="ml-1 text-down dark:text-down-light">*</span>}
      </label>
      <select
        value={value?._ref ?? ''}
        onChange={handleChange}
        disabled={options === null || isEmpty}
        className={`w-full rounded-sm border bg-paper px-3 py-2 font-sans text-sm text-ink transition-colors focus:border-accent focus:outline-none disabled:opacity-60 dark:bg-graphite dark:text-ink-inverse ${
          error
            ? 'border-down dark:border-down-light'
            : 'border-hairline dark:border-hairline-dark'
        }`}
      >
        <option value="">
          {options === null
            ? 'Loading…'
            : isEmpty
              ? `No ${typeLabel} documents`
              : `Select a ${typeLabel}…`}
        </option>
        {(options ?? []).map((opt) => (
          <option key={opt._id} value={opt._id}>
            {opt.label || opt._id}
          </option>
        ))}
      </select>
      {loadError && (
        <p className="mt-1.5 text-caption text-down dark:text-down-light">
          Could not load {typeLabel} options. Check your Sanity permissions.
        </p>
      )}
      {isEmpty && !loadError && (
        <p className="mt-1.5 text-caption text-ink-muted dark:text-ink-inverse-muted">
          No {typeLabel} documents exist yet. Create one in the{' '}
          <a
            href="/studio"
            className="text-accent underline-offset-2 hover:underline dark:text-accent-light"
          >
            Studio
          </a>{' '}
          first.
        </p>
      )}
      {error && (
        <p className="mt-1.5 text-caption text-down dark:text-down-light">
          {error}
        </p>
      )}
    </div>
  )
}
