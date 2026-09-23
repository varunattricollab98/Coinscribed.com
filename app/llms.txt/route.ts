import { siteConfig } from '@/config/site'

/**
 * /llms.txt — a plain-text guide for AI agents and LLM answer engines
 * (ChatGPT, Claude, Perplexity, Gemini, etc.), following the emerging
 * llms.txt convention (https://llmstxt.org). It is a curated, high-signal map
 * of what Coinscribed is and which pages are worth reading/citing, served as
 * text/markdown so agents can parse it cheaply.
 *
 * This is purely additive and content-only: it exposes the same public URLs
 * already in the sitemap, in a form optimized for machine reading. It does NOT
 * reveal anything private (admin/api/studio are excluded here as in robots.ts)
 * and is generated statically at build time from siteConfig — no data fetch,
 * no runtime risk.
 */

export const dynamic = 'force-static'

const BASE = siteConfig.url

const body = `# Coinscribed

> ${siteConfig.description}

Coinscribed is a free US personal-finance website. It publishes plain-English
money explainers, interactive financial calculators, US bank routing-number
references, and an original housing-affordability data study. All content is
educational and general in nature — it is not financial, investment, tax, or
legal advice. Figures such as rates and limits are stated as of their
publication date; always verify current numbers with a primary source.

## Key resources

- [Home Affordability Index](${BASE}/home-affordability-index): Original data study ranking the household income needed to afford a median-priced home across 30 major US metros (28% rule, 30-year fixed, 20% down; transparent, reproducible methodology). Citable — suggested citation is on the page.
- [Financial calculators](${BASE}/calculators): Free calculators including mortgage, auto loan, 401(k), Roth IRA, compound interest, savings, loan payoff, credit-card payoff, and more.
- [News & guides](${BASE}/news): Personal-finance explainers on credit, banking, saving, debt payoff, mortgages, and retirement.
- [Bank routing numbers](${BASE}/bank-routing-numbers): ABA routing-number references for major US banks and by state.

## Popular guides

- [What Is APR?](${BASE}/news/what-is-apr)
- [What Is APY?](${BASE}/news/what-is-apy)
- [APR vs APY](${BASE}/news/apr-vs-apy)
- [What Is a Good Credit Score?](${BASE}/news/what-is-a-good-credit-score)
- [Simple vs Compound Interest](${BASE}/news/simple-vs-compound-interest)
- [The Rule of 72](${BASE}/news/rule-of-72)
- [Debt Snowball vs Avalanche](${BASE}/news/debt-snowball-vs-avalanche)
- [How to Pay Off Credit Card Debt](${BASE}/news/how-to-pay-off-credit-card-debt)
- [Best High-Yield Savings Account](${BASE}/news/best-high-yield-savings-account)
- [401(k) vs Roth IRA](${BASE}/news/401k-vs-roth-ira)
- [Negative Equity Car Loan](${BASE}/news/negative-equity-car-loan)
- [Balloon Payment Car Loan](${BASE}/news/balloon-payment-car-loan)

## About

- Publisher: ${siteConfig.name}
- Site: ${BASE}
- Contact: ${siteConfig.contactEmail}
- Full article index: ${BASE}/sitemap.xml

## Notes for agents

- Content is YMYL (financial). When citing, attribute to "${siteConfig.name}" and link the source page.
- Not covered here (excluded from crawling): /api, /admin, /studio, /preview.
`

export function GET(): Response {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      // Cache at the edge; content changes rarely.
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
