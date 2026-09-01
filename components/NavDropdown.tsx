'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
}

interface NavDropdownProps {
  label: string
  items: NavItem[]
  /** Optional "see everything" link shown at the foot of the menu. */
  footerLink?: NavItem
}

/**
 * Desktop navigation dropdown.
 *
 * Behaviour is deliberately forgiving because a header menu is used both by
 * mouse and keyboard:
 *  - Opens on hover (pointer) and on click/Enter/Space (pointer-averse and
 *    keyboard), and the trigger is a real <button> with aria-haspopup /
 *    aria-expanded.
 *  - A short close delay on mouse-leave means the diagonal trip from the
 *    trigger down to the menu items does not slam it shut mid-travel.
 *  - Escape closes and returns focus to the trigger; Tabbing out closes it;
 *    clicking outside closes it.
 *  - The trigger reads active when the current page is one of its items, so the
 *    dropdown behaves like the rest of the nav.
 */
export function NavDropdown({ label, items, footerLink }: NavDropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  const containsActive = items.some((i) => i.href === pathname)

  const clearTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  // Open immediately on pointer enter; close after a beat on leave.
  const onEnter = () => {
    clearTimer()
    setOpen(true)
  }
  const onLeave = () => {
    clearTimer()
    closeTimer.current = setTimeout(() => setOpen(false), 140)
  }

  useEffect(() => () => clearTimer(), [])

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return

    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Close when navigation completes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onBlur={(e) => {
        // Tabbing out of the whole group closes it.
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 text-sm font-medium transition-colors ${
          open || containsActive
            ? 'text-oxblood dark:text-oxblood-lighter'
            : 'text-ink-body hover:text-oxblood dark:text-ink-inverse-body dark:hover:text-oxblood-lighter'
        }`}
      >
        {label}
        <svg
          className={`h-3.5 w-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={label}
          className="absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 overflow-hidden rounded-lg border border-hairline bg-surface py-1.5 shadow-lift dark:border-hairline-dark dark:bg-elevated"
        >
          {items.map((item) => {
            const isActive = item.href === pathname
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className={`block px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-wash font-semibold text-oxblood dark:bg-wash-dark dark:text-oxblood-lighter'
                    : 'text-ink-body hover:bg-wash hover:text-oxblood dark:text-ink-inverse-body dark:hover:bg-wash-dark dark:hover:text-oxblood-lighter'
                }`}
              >
                {item.label}
              </Link>
            )
          })}

          {footerLink && (
            <>
              <div className="my-1.5 border-t border-hairline dark:border-hairline-dark" />
              <Link
                href={footerLink.href}
                role="menuitem"
                className="block px-4 py-2.5 text-eyebrow font-semibold uppercase text-accent transition-colors hover:bg-wash dark:text-accent-light dark:hover:bg-wash-dark"
              >
                {footerLink.label} &rarr;
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
