# Coinscribed.com — Project Context & Working Agreement

> This file is the persistent memory for the Coinscribed.com project. Read it at
> the start of every session so you (the agent) resume with full context and the
> owner never has to re-explain. Keep it updated as things change.

---

## 1. What this is

**Coinscribed.com** — a live personal-finance content website. Solo-owned.
Goal: grow **organic US traffic + earning** through high-quality finance content.

- **Stack:** Next.js (App Router) + Sanity CMS, deployed on **Vercel**.
- **Repo:** `varunattricollab98/Coinscribed.com` (GitHub).
- **Live:** https://coinscribed.com (apex 308-redirects to `https://www.coinscribed.com`).

## 2. Roles & working style

- The owner treats the agent as the **CEO / SEO strategist**: the **agent decides**
  strategy (topics, keywords, technical fixes, priorities); the **owner executes**
  (publishes to Sanity, clicks GSC/Bing indexing).
- **Reply language: Hinglish** (Hindi + English mix, casual, "bhai" tone).
- The agent has **NO Sanity / CMS access**. Articles are delivered **paste-ready in
  chat** for the owner to paste into the Sanity editor.
- Owner shares **SEMrush data as TEXT** — never as XLSX (uploaded XLSX arrives as
  garbled binary and is unreadable). Always ask for text.

## 3. Content cadence & format

- **5 articles/week**, published Tue–Fri at **8:00 AM ET** (weekends off).
- Human-written, AI-detection-proof, SEO + GEO optimized, Google-safe, and
  **realistic/genuinely useful** (real numbers people can act on).
- **Paste-ready delivery** = Sanity fields + body with editor markers:
  - Fields: **Title**, **Slug** (<=96), **Excerpt** (<=300), **SEO Title** (<=70),
    **SEO Description** (<=160), **Author**, **Category**, schedule.
  - Body markers: `[H2]` `[H3]` `[H4]` `[Bullet]` `[Table]` `[Normal]`, bold via `**..**`,
    links as `[link -> /path]`. Body is Sanity Portable Text supporting H2/H3/H4/Quote,
    bold/italic/underline/code/link, and a custom **tableBlock** (caption + column
    headers + rows).
- **Field limits are intentional — do NOT raise them.**
- Article drafts are saved in the repo at `.agents/drafts/`.

- **Authors:** Ethan Caldwell (Banking), Marcus Bennett (Economy / mortgage),
  Rachel Morgan, Coinscribed Team.
- **Categories:** Banking, Economy, Markets, Crypto.

## 4. YMYL discipline (critical)

This is a financial (YMYL) site. **Never invent or guess** routing numbers, rates,
or financial figures. **Always web-verify current numbers** before writing.

Verified reference numbers (Sept 2026 — re-verify if stale):
- 30-yr fixed mortgage ~6.71%; HYSA / MMA / CD ~4.00–4.50% APY; inflation ~3.3%.
- Down payment minimums: conventional 3%, FHA 3.5%, VA/USDA 0%; avg ~13% national,
  ~8% first-time; 20% avoids PMI. Closing costs 2–5%.

## 5. Dev / deployment facts

- **Admin/CMS:** `/admin` and `/studio` (Sanity).
- **Sanity CORS fix** (for "Session could not be verified" login error):
  manage.sanity.io → API → CORS Origins → add **both** `https://coinscribed.com` and
  `https://www.coinscribed.com`, each with **"Allow credentials" CHECKED**.
- **DNS (Hostinger → Vercel):** `A @ 76.76.21.21`; `CNAME www 353687749f236ec8.vercel-dns-017.com`.
  Apex 308→www, so `curl` needs `-L`; sitemap is at `www.coinscribed.com/sitemap.xml`.
- **Vercel env:** `NEXT_PUBLIC_GA_ID = G-FM6XPPT1S6`.

### Build / PR workflow (do every time before a PR)
1. `bunx tsc --noEmit` + `bunx next lint` + `bunx next build` — all must be clean.
2. **Always revert bun.lock** (`git checkout bun.lock`) — never commit it.
3. Never commit to `main`. Create a feature branch, push, open PR with
   `gh api repos/varunattricollab98/Coinscribed.com/pulls -f title=... -f body=... -f head=... -f base="main"`
   (NOT `gh pr create` — GraphQL-backed commands fail in this environment).
4. Wait for CI **build** checks to pass, then squash-merge:
   `gh api -X PUT repos/.../pulls/{n}/merge -f merge_method="squash"`.
5. Reference the PR/branch link for the owner to review.

## 6. Architecture notes

- **Homepage** needs 17 articles to fill all sections (1 featured + 6 secondary +
  6 rail + 4 Editor's Picks). Editor's Picks grid now **adapts to article count**
  (empty grey-slot bug fixed).
- **Related articles** are **category-only** (no tags/relatedArticles field in the
  Sanity schema).
- **Calculators:** 13 total. Each has a `layout.tsx` with a correct self-canonical +
  metadata. `CalculatorLayout` takes a `canonicalPath` prop to emit BreadcrumbList
  JSON-LD. Sitemap generates calculator URLs from `data/calculators` and uses
  `_updatedAt` for article `lastModified`.
- **favicon.ico** exists (generated from icon.png) — fixes the generic globe icon
  that Google showed on non-homepage results.

## 7. SEO / indexing plan

**Google (GSC, ~10 URLs/day request limit):**
- DONE: all 13 calculators + `/calculators` hub + `/news/401k-vs-roth-ira`.
  (~12 pages were already indexed organically.)
- Remaining priority order:
  - P2: articles (`how-much-to-contribute-to-401k`, `how-to-find-routing-number-on-check`,
    `what-is-apy`) + hubs (`/news`, `/markets`, `/bank-routing-numbers`, `/about`).
  - P3: category + author pages.
  - P4: 23 per-bank pages (~10/day).
  - P5: 32 **index-worthy** state pages (>=3 banks; high-bank first).
- **NEVER** request-index: the 15 **thin** state pages (<3 banks — they are
  `noindex,follow` via `MIN_BANKS_TO_INDEX=3`), or `sitemap.xml`.
- When a **brand-new article** goes live, request-index it FIRST (Google + Bing).

**Bing:** sitemap submitted & healthy (~114 URLs discovered). Bing auto-crawls;
only manually submit brand-new articles. IndexNow rejected (not worth it for a
small new site).

## 8. Decisions on record

- **Do NOT invest in per-state bank routing pages** (low search volume, YMYL
  accuracy risk). Focus energy on **articles + calculators + indexing**.
- **Deferred:** add real brand social profile URLs to `config/site.ts` `social`
  object with `confirmed: true` **once the accounts actually exist** — this makes
  `generateOrganizationSchema()` emit the `sameAs` array (currently all
  `confirmed: false` as an intentional YMYL accuracy guard, so `sameAs` is omitted).

## 9. Current status / next up

- Mon–Thu articles delivered paste-ready (owner schedules): How Much House Can I
  Afford (#18), How to Save for a Down Payment, CD vs HYSA vs Money Market (#19),
  How to Write a Check (#20).
- **Friday topic LOCKED = "Money Market Account vs Savings Account"** (Banking) —
  awaiting owner's SEMrush keyword data (as TEXT) to write.
- Continue GSC indexing from **Priority 2**.
- When CD (#19) and Write-a-Check (#20) go live → request-index them first
  (Google + Bing): `/news/cd-vs-high-yield-savings-vs-money-market`,
  `/news/how-to-write-a-check`.

## 10. Live articles (15, in sitemap)

`401k-employer-match-explained`, `401k-vs-roth-ira`, `apr-vs-apy`,
`best-high-yield-savings-account`, `debt-snowball-vs-avalanche`,
`how-much-to-contribute-to-401k`, `how-to-build-an-emergency-fund`,
`how-to-find-routing-number-on-check`, `how-to-pay-off-a-loan-faster`,
`monthly-payment-300k-400k-500k-mortgage`, `rule-of-72`,
`simple-vs-compound-interest`, `what-is-a-good-credit-score`, `what-is-apr`,
`what-is-apy`.
