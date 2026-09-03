'use client'

import { useCallback, useRef, useState } from 'react'
import { adminSanityClient } from '@/lib/sanity-admin'
import { urlFor } from '@/lib/sanity'

/**
 * The image value the uploader edits. It mirrors the Sanity `image` object used
 * by both `article.mainImage` (alt only) and inline body images (alt +
 * optional caption):
 *
 *   { _type:'image', asset:{ _type:'reference', _ref }, alt, caption? }
 */
export interface UploaderImageValue {
  _type: 'image'
  asset?: { _type: 'reference'; _ref: string }
  alt?: string
  caption?: string
}

interface ImageUploaderProps {
  /** Current image value (undefined when none set). */
  value?: UploaderImageValue
  /** Called with the updated image value, or undefined when removed. */
  onChange: (value: UploaderImageValue | undefined) => void
  /**
   * When `withCaption` is true a caption field is shown (inline body images);
   * otherwise only alt text is collected (featured image).
   */
  withCaption?: boolean
  /** Field label shown above the control. */
  label?: string
}

/** Reject files that are not images or are unreasonably large (> 10 MB). */
const MAX_BYTES = 10 * 1024 * 1024

/**
 * Upload an image to Sanity and edit its alt / caption metadata.
 *
 * The file is uploaded with `adminSanityClient.assets.upload('image', file)`,
 * which runs AS THE LOGGED-IN USER (the client carries the session cookie, no
 * master token). On success the returned asset id is stored as an image object
 * with an asset reference; the preview is rendered through the existing
 * `urlFor()` image-url builder.
 */
export function ImageUploader({
  value,
  onChange,
  withCaption = false,
  label = 'Image',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)
      if (!file.type.startsWith('image/')) {
        setError('Please choose an image file.')
        return
      }
      if (file.size > MAX_BYTES) {
        setError('Image is too large (max 10 MB).')
        return
      }
      setUploading(true)
      try {
        const asset = await adminSanityClient.assets.upload('image', file)
        onChange({
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
          alt: value?.alt ?? '',
          ...(withCaption ? { caption: value?.caption ?? '' } : {}),
        })
      } catch {
        setError('Upload failed. Check your Sanity permissions and try again.')
      } finally {
        setUploading(false)
      }
    },
    [onChange, value?.alt, value?.caption, withCaption]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) void handleFile(file)
    // Reset so selecting the same file again re-triggers change.
    e.target.value = ''
  }

  const previewUrl = value?.asset?._ref
    ? urlFor({ _type: 'image', asset: value.asset })
        .width(640)
        .fit('max')
        .url()
    : undefined

  return (
    <div>
      <label className="mb-1.5 block font-sans text-caption font-semibold uppercase tracking-wide text-ink-muted dark:text-ink-inverse-muted">
        {label}
      </label>

      {previewUrl ? (
        <div className="overflow-hidden rounded-sm border border-hairline dark:border-hairline-dark">
          {/*
            The uploaded asset can be any remote Sanity CDN URL and is used only
            inside this internal, noindex admin tool, so a plain <img> (rather
            than next/image, which needs configured remote patterns / sizing) is
            the pragmatic choice for a preview thumbnail.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={value?.alt || 'Selected image preview'}
            className="max-h-56 w-full bg-wash object-contain dark:bg-elevated"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-sm border border-dashed border-hairline bg-wash px-4 py-8 text-center dark:border-hairline-dark dark:bg-elevated">
          <span className="text-caption text-ink-muted dark:text-ink-inverse-muted">
            No image selected
          </span>
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center rounded-sm border border-hairline px-3 py-1.5 font-sans text-sm text-ink-body transition-colors hover:border-accent hover:text-accent disabled:opacity-60 dark:border-hairline-dark dark:text-ink-inverse-body dark:hover:border-accent-light dark:hover:text-accent-light"
        >
          {uploading
            ? 'Uploading…'
            : value?.asset
              ? 'Replace image'
              : 'Upload image'}
        </button>
        {value?.asset && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            disabled={uploading}
            className="inline-flex items-center rounded-sm border border-hairline px-3 py-1.5 font-sans text-sm text-ink-muted transition-colors hover:border-down hover:text-down disabled:opacity-60 dark:border-hairline-dark dark:text-ink-inverse-muted dark:hover:border-down-light dark:hover:text-down-light"
          >
            Remove
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-caption text-down dark:text-down-light">
          {error}
        </p>
      )}

      {value?.asset && (
        <div className="mt-3 space-y-2">
          <div>
            <label className="mb-1 block font-sans text-caption text-ink-muted dark:text-ink-inverse-muted">
              Alt text
            </label>
            <input
              type="text"
              value={value.alt ?? ''}
              onChange={(e) =>
                onChange({ ...value, alt: e.target.value })
              }
              placeholder="Describe the image for screen readers"
              className="w-full rounded-sm border border-hairline bg-paper px-3 py-2 font-sans text-sm text-ink focus:border-accent focus:outline-none dark:border-hairline-dark dark:bg-graphite dark:text-ink-inverse"
            />
          </div>
          {withCaption && (
            <div>
              <label className="mb-1 block font-sans text-caption text-ink-muted dark:text-ink-inverse-muted">
                Caption
              </label>
              <input
                type="text"
                value={value.caption ?? ''}
                onChange={(e) =>
                  onChange({ ...value, caption: e.target.value })
                }
                placeholder="Optional caption shown under the image"
                className="w-full rounded-sm border border-hairline bg-paper px-3 py-2 font-sans text-sm text-ink focus:border-accent focus:outline-none dark:border-hairline-dark dark:bg-graphite dark:text-ink-inverse"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
