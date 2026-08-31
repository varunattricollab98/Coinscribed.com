import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

/**
 * Layout for the public-facing site. Wraps every marketing/content page in the
 * shared header and footer. The embedded Sanity Studio at /studio deliberately
 * lives outside this group so it renders full-screen with no site chrome.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
