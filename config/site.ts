export const siteConfig = {
  name: 'Coinscribed',
  tagline: 'Your Trusted Source for Financial Intelligence',
  description:
    'Coinscribed provides financial calculators, crypto and market news, US bank routing numbers, and personal finance tools to help you make informed decisions.',
  url: 'https://coinscribed.com',
  ogImage: 'https://coinscribed.com/og-image.png',
  locale: 'en_US',
  creator: 'Coinscribed',
  keywords: [
    'finance',
    'calculators',
    'crypto news',
    'bank routing numbers',
    'mortgage calculator',
    'retirement planning',
    'personal finance',
  ],
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Calculators', href: '/calculators' },
    { label: 'News', href: '/news' },
    { label: 'Bank Routing Numbers', href: '/bank-routing-numbers' },
  ],
  footer: {
    calculators: [
      { label: 'Mortgage Calculator', href: '/calculators/mortgage-calculator' },
      { label: '401(k) Calculator', href: '/calculators/401k-calculator' },
      { label: 'EMI Calculator', href: '/calculators/emi-calculator' },
      { label: 'SIP Calculator', href: '/calculators/sip-calculator' },
      { label: 'Loan Payoff Calculator', href: '/calculators/loan-payoff-calculator' },
      { label: 'Compound Interest', href: '/calculators/compound-interest-calculator' },
      { label: 'Retirement Calculator', href: '/calculators/retirement-calculator' },
    ],
    resources: [
      { label: 'News', href: '/news' },
      { label: 'Bank Routing Numbers', href: '/bank-routing-numbers' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  },
  social: {
    twitter: 'https://twitter.com/coinscribed',
    facebook: 'https://facebook.com/coinscribed',
    linkedin: 'https://linkedin.com/company/coinscribed',
  },
}

export type SiteConfig = typeof siteConfig
