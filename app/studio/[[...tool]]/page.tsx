/**
 * Embedded Sanity Studio, served at /studio on this site's own domain.
 *
 * This catch-all route hosts the full admin/editing tool. Writers and editors
 * open /studio, log in with their Sanity account, and manage all articles.
 */
import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'

// The Studio is a client-heavy, always-dynamic app; never statically export it.
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function StudioPage() {
  return <NextStudio config={config} />
}
