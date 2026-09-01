'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { siteConfig } from '@/config/site'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-white/95 backdrop-blur-sm dark:border-hairline-dark dark:bg-ink/95">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-serif text-xl font-bold text-ink dark:text-white">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex" aria-label="Main navigation">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink-body transition-colors hover:text-oxblood dark:text-ink-inverse-body dark:hover:text-oxblood-lighter"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Theme toggle + Mobile menu button */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-md p-2 text-ink-muted transition-colors hover:bg-wash hover:text-oxblood dark:hover:bg-wash-dark dark:hover:text-oxblood-lighter"
              aria-label="Toggle dark mode"
            >
              {/* Sun icon (shown in dark mode) */}
              <svg
                className="hidden h-5 w-5 dark:block"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
              {/* Moon icon (shown in light mode) */}
              <svg
                className="block h-5 w-5 dark:hidden"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-md p-2 text-ink-muted transition-colors hover:bg-wash hover:text-ink md:hidden dark:hover:bg-wash-dark dark:hover:text-ink-inverse"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/*
        Category sub-navigation.

        A deliberately quiet second row: eyebrow-scale uppercase on a hairline
        band, so it reads as a sub-level of the masthead rather than a second
        primary nav. It scrolls horizontally on narrow screens instead of
        wrapping into a tall block, which would push the whole page down on the
        devices that can least afford it.
      */}
      <div className="border-t border-hairline dark:border-hairline-dark">
        <div className="container-page">
          <nav
            aria-label="News sections"
            className="scrollbar-none -mx-4 flex items-center gap-6 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            {/* Signals "these are sections", and is pure ornament. */}
            <span
              aria-hidden="true"
              className="hidden shrink-0 items-center gap-2 lg:flex"
            >
              <span className="eyebrow-royal">Sections</span>
              <span className="gold-rule w-6" />
            </span>

            {siteConfig.categoryNav.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative shrink-0 whitespace-nowrap py-2.5 text-eyebrow font-semibold uppercase transition-colors duration-150 ${
                    isActive
                      ? 'text-accent dark:text-accent-light'
                      : 'text-ink-muted hover:text-accent dark:text-ink-inverse-muted dark:hover:text-accent-light'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-accent-gradient"
                    />
                  )}
                </Link>
              )
            })}

            {/* Hidden on phones so the scrollable row holds only the four
                sections and nothing has to be scrolled past to reach them. */}
            <Link
              href="/news"
              className="link-more ml-auto hidden shrink-0 py-2.5 pl-6 md:inline-flex"
            >
              All News
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="container-page">
          <nav
            className="border-t border-hairline pb-4 pt-2 md:hidden dark:border-hairline-dark"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-2">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-ink-body transition-colors hover:bg-wash hover:text-oxblood dark:text-ink-inverse-body dark:hover:bg-wash-dark dark:hover:text-oxblood-lighter"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
