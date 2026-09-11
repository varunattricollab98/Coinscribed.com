# Coinscribed.com — Project Context & Working Agreement

> Persistent project memory. Read at the start of every session so you (the
> agent) resume with full context and the owner never has to re-explain. Keep it
> updated as things change.

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

## 3. Content cadence & article standard

- **5 articles/week**, published Tue–Fri at **8:00 AM ET** (weekends off). Owner can
  send data for 2-3 articles at once and schedule on different days.
- **Standard (mandatory):** 100% human-written & AI-detection-proof (real
  personal-story intro, burstiness, conversational asides, contractions, opinion;
  NO AI-cliché words like delve/furthermore/unlock); web-verified live numbers
  (IRS/Fed/FDIC/Freddie Mac); target LOW-KD winnable long-tails when the head term
  KD is high; GEO — match Google AI Overview structure, Quick/Short Answer near the
  top, clean extractable definitions; comparison tables to differentiate; 6-8 FAQs
  from PAA; internal links to a calculator + related article (topic-cluster,
  same-tab); topic-appropriate author for E-E-A-T; evergreen (avoid volatile exact
  rates — round them).
- **Paste-ready delivery** = Sanity fields + body with editor markers:
  - Fields: **Title**, **Slug** (<=96), **Excerpt** (<=300), **SEO Title** (<=70),
    **SEO Description** (<=160), **Author**, **Category**, schedule.
  - Body markers: `[H2]` `[H3]` `[H4]` `[Bullet]` `[Table]` `[Normal]`, bold via `**..**`,
    links as `[link -> /path]`. Portable Text supports H2/H3/H4/Quote,
    bold/italic/underline/code/link, and a custom **tableBlock** (caption + column
    headers + rows).
  - **Field limits are intentional — do NOT raise them.**
- **Do NOT add a manual disclaimer / "A Quick Note" section** — `ArticleView.tsx`
  auto-renders an "Editorial Notice" box at the end of every article.
- **Before writing, CHECK the master inventory (section 9) to avoid duplicates /
  cannibalization.**
- Article drafts are saved in the repo at `.agents/drafts/`.

- **Authors:** Ethan Caldwell (Banking), Marcus Bennett (Economy / mortgage / loans),
  Rachel Morgan (retirement / economy), Coinscribed Team.
- **Categories:** Banking, Economy, Markets, Crypto.

## 4. YMYL discipline (critical)

Financial (YMYL) site. **Never invent or guess** routing numbers, rates, or
financial figures. **Always web-verify current numbers** before writing.
Verified reference numbers (Sept 2026 — re-verify if stale):
- 30-yr fixed mortgage ~6.71%; HYSA / MMA / CD ~4.00–4.50% APY; inflation ~3.3%.
- Down payment minimums: conventional 3%, FHA 3.5%, VA/USDA 0%; avg ~13% national,
  ~8% first-time; 20% avoids PMI. Closing costs 2–5%.
- 2026 IRS: 401k $24,500, IRA $7,500, 401k catch-up $8,000, IRA catch-up $1,100.

## 5. Dev / deployment facts

- **Admin/CMS:** `/admin` (custom editor) and `/studio` (Sanity Studio). Sanity
  project ID **h0xv92n1**, dataset `production`.
- **DNS (Hostinger → Vercel):** `A @ 76.76.21.21`; `CNAME www 353687749f236ec8.vercel-dns-017.com`.
  Apex 308→www, so `curl` needs `-L`; sitemap is at `www.coinscribed.com/sitemap.xml`.
- **Vercel env:** `NEXT_PUBLIC_GA_ID = G-FM6XPPT1S6`. GA property live; keep the GSC
  verification TXT record in Hostinger DNS.
- **`SANITY_WRITE_TOKEN`** — needed in Vercel for the newsletter to store signups
  (see section 8). Editor-scoped token from manage.sanity.io → API → Tokens.

### Admin login (two fixes already shipped — if it breaks again, check these)
1. **CORS** (for "Session could not be verified"): manage.sanity.io → API → CORS
   Origins must include **both** `https://www.coinscribed.com` (admin runs here) and
   `https://coinscribed.com`, each with **"Allow credentials" CHECKED**, no trailing
   slash, https.
2. **Login endpoint** (`getLoginUrl` in `lib/sanity-admin.ts`) must point at
   `https://www.sanity.io/login?origin=...&type=token&withSid=true` — NOT the retired
   `api.sanity.io/v1/auth/login` (that 404s "Cannot GET"). The `?sid=` return code is
   exchanged for a token via `/auth/fetch?sid=` in `captureTokenFromUrl`.
3. **Guaranteed fallback:** `https://coinscribed.com/studio` (official Sanity Studio,
   robust login, always works) — content can always be managed there.

### Build / PR workflow (do every time before a PR)
1. `bunx tsc --noEmit` + `bunx next lint` + `bunx next build` — all must be clean.
2. **Always revert bun.lock** (`git checkout bun.lock`) — never commit it.
3. Never commit to `main`. Create a feature branch, push, open PR with
   `gh api repos/varunattricollab98/Coinscribed.com/pulls -f title=... -f body=... -f head=... -f base="main"`
   (NOT `gh pr create` — GraphQL-backed commands fail here).
4. Wait for CI **build** checks to pass, then squash-merge:
   `gh api -X PUT repos/.../pulls/{n}/merge -f merge_method="squash"`. Owner is fine
   with the agent merging its own PRs.
5. Reference the PR/branch link for the owner.

## 6. Architecture notes

- **Homepage** needs 17 articles to fill all sections (1 featured + 6 secondary +
  6 rail + 4 Editor's Picks). Editor's Picks grid now **adapts to article count**
  (empty grey-slot bug fixed).
- **Related articles** are **category-only** (no tags/relatedArticles field in the
  Sanity schema).
- **Calculators:** 13 total (mortgage, 401k, emi, sip, loan-payoff,
  compound-interest, retirement, auto-loan, credit-card-payoff, savings,
  emergency-fund, roth-ira, apy). Each has a `layout.tsx` with a correct
  self-canonical + metadata (CONFIRMED good — don't re-flag as missing).
  `CalculatorLayout` takes a `canonicalPath` prop to emit BreadcrumbList JSON-LD.
  Sitemap generates calculator URLs from `data/calculators`.
- **favicon.ico** exists (generated from icon.png) — fixed the generic globe icon.
- **Admin `/admin` list** (`app/admin/page.tsx`) has: count pills (clickable status
  filters — Total/Published/Scheduled/Draft with active-ring, synced to the status
  dropdown), search box, status + category dropdowns, a serial `#` column, and a
  Preview link per row (opens `/preview/articles/{id}` — works for drafts/scheduled).
- **404:** branded `app/(site)/not-found.tsx` (site chrome, links to
  News/Calculators/Markets/Bank routing, noindex,follow).
- **Key Takeaways (GEO):** articles have an optional `keyTakeaways` field (array of
  strings, in the Sanity schema after `excerpt`); rendered by `KeyTakeaways` in
  `ArticleView` under the hero, above the TOC. Add 3-5 crisp bullets per article
  for AI Overview / featured-snippet pickup — especially on already-ranking articles.
  Editable in BOTH `/studio` AND the custom `/admin` editor now (field sits right
  after Excerpt: "Add takeaway" list, max 6, empty items dropped on save; the
  gold-dot bullet is auto-rendered so enter plain sentences, no bullet symbol).
- **DELIBERATELY EXCLUDED calculators** (YMYL risk, don't build without care):
  income tax, paycheck, capital gains, Social Security.

## 7. SEO / indexing plan

**Google (GSC, ~10-12 URLs/day request limit; quota resets daily, ~8pm owner time):**
- INDEXED organically (13, confirmed via site: search): homepage, /markets,
  /calculators/mortgage-calculator, and articles rule-of-72, apr-vs-apy, what-is-apr,
  401k-employer-match-explained, simple-vs-compound-interest, debt-snowball-vs-avalanche,
  best-high-yield-savings-account, how-to-build-an-emergency-fund, what-is-a-good-credit-score,
  monthly-payment-300k-400k-500k-mortgage.
- **BATCH A DONE:** /news/{what-is-apy, how-to-pay-off-a-loan-faster, how-to-pay-off-credit-card-debt,
  401k-vs-roth-ira, how-much-to-contribute-to-401k, how-to-find-routing-number-on-check},
  /calculators, /calculators/{compound-interest, loan-payoff, retirement}-calculator.
- **BATCH B (next):** /calculators/{401k, savings, apy, auto-loan, credit-card-payoff,
  emergency-fund, roth-ira, emi, sip}-calculator, /news.
- **BATCH C:** /bank-routing-numbers, /about, /news/category/{banking,economy,markets,crypto},
  /news/author/{ethan-caldwell,marcus-bennett,rachel-morgan,coinscribed-team}.
- **BATCH D + E:** 23 per-bank pages (~10/day).
- **NEVER** request-index: the 15 **thin** state pages (<3 banks — `noindex,follow`
  via `MIN_BANKS_TO_INDEX=3`), `sitemap.xml`; legal pages are lowest priority; never
  re-request the already-indexed 13.
- When a **brand-new article** goes live, request-index it FIRST (Google + Bing).

**Bing:** sitemap submitted & healthy (~114 URLs). Bing auto-crawls; only manually
submit brand-new articles. IndexNow rejected (not worth it for a small new site).

**Decision:** do NOT invest in per-state bank routing pages (low volume, YMYL risk).
Focus energy on articles + calculators + indexing.

## 8. Newsletter (functional as of PR #46)

- Signups are stored as Sanity `subscriber` docs (email/subscribedAt/source),
  visible in Studio under **Newsletter Subscriber**. `POST /api/newsletter`
  validates + de-dupes and writes via a **server-only `SANITY_WRITE_TOKEN`**.
- **PENDING owner action:** add `SANITY_WRITE_TOKEN` in Vercel (Production + Preview)
  for signups to work in prod. Until then the route returns 503 and the form shows
  an honest "temporarily unavailable" message (no fake success).
- **Deferred:** add real brand social profile URLs to `config/site.ts` `social` with
  `confirmed: true` once the accounts exist — this makes `generateOrganizationSchema()`
  emit `sameAs` (E-E-A-T). Currently all `confirmed: false` (intentional YMYL guard).

## 9. Article inventory (source of truth for slugs; avoid duplicates)

URLs are `https://www.coinscribed.com/news/<slug>`.

**LIVE (16, in sitemap):** 401k-employer-match-explained, 401k-vs-roth-ira, apr-vs-apy,
best-high-yield-savings-account, debt-snowball-vs-avalanche, how-much-to-contribute-to-401k,
how-to-build-an-emergency-fund, how-to-find-routing-number-on-check, how-to-pay-off-a-loan-faster,
how-to-pay-off-credit-card-debt, monthly-payment-300k-400k-500k-mortgage, rule-of-72,
simple-vs-compound-interest, what-is-a-good-credit-score, what-is-apr, what-is-apy.

**WRITTEN & DELIVERED but NOT yet live (404 — owner still to publish/schedule; drafts
in `.agents/drafts/`):** cd-vs-high-yield-savings-vs-money-market (Banking/Ethan),
how-to-write-a-check (Banking/Marcus, 246K/mo), how-much-house-can-i-afford (Economy/Marcus),
how-to-save-for-a-down-payment (Economy/Marcus), what-is-a-roth-ira (Economy/Rachel).
When each goes live, request-index it first on Google + Bing.

**Clusters:** Retirement (401k-match, how-much-401k, 401k-vs-roth-ira, what-is-a-roth-ira),
Debt (debt-snowball, loan-payoff-faster, credit-card-debt), Banking (apr, apy, apr-vs-apy,
credit-score, hysa, routing, cd-vs-hysa-vs-mmkt, write-a-check), Interest (simple-vs-compound,
rule-of-72), Mortgage (monthly-payment, how-much-house, down-payment).

## 10. Current status / next up

- **KEY TAKEAWAYS ADDED to all articles (owner did this via `/admin`).** Each got
  3-5 GEO bullets. `rule-of-72` was request-indexed on Google; the rest hit the daily
  GSC quota. **TOMORROW (quota reset): request-index the remaining updated articles on
  Google** (~10-12/day) — priority the already-ranking ones first: apr-vs-apy, what-is-apr,
  what-is-a-good-credit-score, 401k-employer-match-explained, simple-vs-compound-interest,
  debt-snowball-vs-avalanche, best-high-yield-savings-account, how-to-build-an-emergency-fund,
  monthly-payment-300k-400k-500k-mortgage; then the Batch-A ones. Bing: no action (auto-crawls
  updated pages; only brand-new articles get manual Bing submits).
- **"Money Market vs Savings Account"** was the tentative Friday topic, but it would
  cannibalize the already-written CD-vs-HYSA-vs-Money-Market (#19). Prefer a fresh
  non-overlapping topic next; get the owner's SEMrush data (as TEXT) for whatever
  topic is chosen. Candidate fresh topics: "How to Open a Bank Account",
  "Checking vs Savings Account", "What Is a Money Market Account?" (standalone def),
  "50/30/20 budgeting", "index funds for beginners".
- Continue GSC indexing from Priority 2 (section 7). Google daily quota resets ~daily;
  if "Quota exceeded", resume next day (sitemap auto-crawls anyway).
- Remind owner to set `SANITY_WRITE_TOKEN` in Vercel for the newsletter.
