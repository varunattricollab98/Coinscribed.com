'use client'

import { createContext, useContext } from 'react'
import type { SanityUser } from '@/lib/sanity-admin'

/**
 * React context carrying the currently logged-in Sanity user through the admin
 * shell. `AdminAuthGate` only renders its children once a user is present, so
 * consumers inside the shell can rely on `user` being non-null.
 */
export interface AdminUserContextValue {
  user: SanityUser
}

export const AdminUserContext = createContext<AdminUserContextValue | null>(null)

/**
 * Read the current admin user from context. Throws if used outside
 * `AdminAuthGate`, which guarantees the value is available.
 */
export function useAdminUser(): SanityUser {
  const ctx = useContext(AdminUserContext)
  if (!ctx) {
    throw new Error('useAdminUser must be used within AdminAuthGate')
  }
  return ctx.user
}
