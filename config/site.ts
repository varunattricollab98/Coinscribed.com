export const siteConfig = {
  name: 'Coinscribed',
  tagline: 'Your Trusted Source for Financial Intelligence',
  description:
    'Coinscribed provides financial calculators, crypto and market news, US bank routing numbers, and personal finance tools to help you make informed decisions.',
  // Use the canonical www host everywhere. The apex (coinscribed.com)
  // 308-redirects to www, so emitting apex URLs in the sitemap, canonicals,
  // robots, JSON-LD and OG tags made Google hit a redirect on every URL —
  // which showed up as "Redirect error" (pages left unindexed) in Search
  // Console. Pointing the single source of truth at www removes that redirect
  // hop so Google indexes the final URL directly.
  url: 'https://www.coinscribed.com',
  ogImage: 'https://www.coinscribed.com/og-image.png',
  locale: 'en_US',
  creator: 'Coinscribed',
  /**
   * Primary contact address, shown on the /contact page and used as the
   * mailto fallback if the contact form is ever unavailable. Update this to the
   * real brand mailbox once it exists (e.g. a Hostinger/Zoho @coinscribed.com
   * address). Kept here as the single source of truth.
   */
  contactEmail: 'varun@coinscribed.com',
  keywords: [
    'finance',
    'calculators',
    'crypto news',
    'bank routing numbers',
    'mortgage calculator',
    'retirement planning',
    'personal finance',
  ],
  // Primary navigation. `categories` is a dropdown driven by `categoryNav`
  // below rather than its own page, so it carries no href — the Header renders
  // it as a menu. Order: Home, News, Calculators, Categories, Bank Routing
  // Numbers, About.
  nav: [
    { label: 'Home', href: '/' },
    { label: 'News', href: '/news' },
    { label: 'Markets', href: '/markets' },
    { label: 'Calculators', href: '/calculators' },
    { label: 'Categories', dropdown: 'categories' as const },
    { label: 'Bank Routing Numbers', href: '/bank-routing-numbers' },
    { label: 'About', href: '/about' },
  ],
  /**
   * The four editorial sections, surfaced as the masthead's slim second row.
   *
   * Declared here rather than inside `Header` so the sub-nav, the homepage
   * topic tiles and anything else that needs the canonical section list read
   * from a single source. Slugs must match the category slugs the newsroom
   * publishes under (`/news/category/<slug>`).
   */
  categoryNav: [
    { label: 'Crypto', href: '/news/category/crypto' },
    { label: 'Economy', href: '/news/category/economy' },
    { label: 'Markets', href: '/news/category/markets' },
    { label: 'Banking', href: '/news/category/banking' },
  ],
  footer: {
    calculators: [
      { label: 'Mortgage Calculator', href: '/calculators/mortgage-calculator' },
      { label: 'Auto Loan Calculator', href: '/calculators/auto-loan-calculator' },
      { label: 'Loan Payoff Calculator', href: '/calculators/loan-payoff-calculator' },
      { label: 'EMI Calculator', href: '/calculators/emi-calculator' },
      { label: 'Credit Card Payoff', href: '/calculators/credit-card-payoff-calculator' },
      { label: 'Compound Interest', href: '/calculators/compound-interest-calculator' },
      { label: 'Savings Calculator', href: '/calculators/savings-calculator' },
      { label: 'APY Calculator', href: '/calculators/apy-calculator' },
      { label: 'Emergency Fund Calculator', href: '/calculators/emergency-fund-calculator' },
      { label: '401(k) Calculator', href: '/calculators/401k-calculator' },
      { label: 'Roth IRA Calculator', href: '/calculators/roth-ira-calculator' },
      { label: 'Retirement Calculator', href: '/calculators/retirement-calculator' },
      { label: 'SIP Calculator', href: '/calculators/sip-calculator' },
    ],
    resources: [
      { label: 'News', href: '/news' },
      { label: 'Bank Routing Numbers', href: '/bank-routing-numbers' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Calculators', href: '/calculators' },
      { label: 'News', href: '/news' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  },
  /**
   * Official social profiles.
   *
   * IMPORTANT (YMYL / factual accuracy): the URLs below are PLACEHOLDERS and
   * have NOT been verified as live, owned accounts. Because this is a finance
   * site, an unverified profile emitted as fact in Organization schema
   * (`sameAs`) or a Twitter card is a real trust/accuracy risk, so the schema
   * layer only emits handles whose `confirmed` flag is `true`.
   *
   * To publish a handle: create/confirm the real account, put its exact URL
   * here, and flip that handle's `confirmed` to `true`. This is the single
   * place to update; nothing else needs to change. Until then the handles are
   * intentionally omitted from all structured data.
   */
  social: {
    twitter: { url: 'https://twitter.com/coinscribed', confirmed: false },
    facebook: { url: 'https://facebook.com/coinscribed', confirmed: false },
    linkedin: { url: 'https://www.linkedin.com/company/coinscribed', confirmed: true },
  },
}

export type SiteConfig = typeof siteConfig
