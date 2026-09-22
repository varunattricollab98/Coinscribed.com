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
- **YEAR IN TITLES rule:** For EVERGREEN topics (salary affordability, definitions,
  how-to, comparisons) do NOT put a year (e.g. "2026") in the Title/SEO Title — keep
  it timeless so it never looks stale (protects CTR when the year turns, less
  maintenance). ONLY put a year in the title for genuinely year-changing topics (IRS
  401k/IRA limits, tax brackets, annual rate roundups) and add a "re-verify yearly"
  note in the body. In body copy prefer "as of <year>" / rounded current rates over
  hard-coded volatile figures.
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
  3-5 GEO bullets. GSC indexing of the updated articles + calculators is now essentially
  DONE (verified via `site:coinscribed.com` — ~18 pages indexed incl. all key articles,
  what-is-a-roth-ira, and most calculators). **ONLY ONE URL STILL PENDING a GSC index
  request: `https://www.coinscribed.com/calculators/sip-calculator`** — submit this on
  the next quota reset, then indexing is fully caught up. Bing: no action (auto-crawls).
- **"Money Market vs Savings Account"** was the tentative Friday topic, but it would
  cannibalize the already-written CD-vs-HYSA-vs-Money-Market (#19). Prefer a fresh
  non-overlapping topic next; get the owner's SEMrush data (as TEXT) for whatever
  topic is chosen. Candidate fresh topics: "How to Open a Bank Account",
  "Checking vs Savings Account", "What Is a Money Market Account?" (standalone def),
  "50/30/20 budgeting", "index funds for beginners".
- Continue GSC indexing from Priority 2 (section 7). Google daily quota resets ~daily;
  if "Quota exceeded", resume next day (sitemap auto-crawls anyway).
- Remind owner to set `SANITY_WRITE_TOKEN` in Vercel for the newsletter.


## 11. STRATEGIC SHIFT — Authority / Backlink phase (Sept 2026)

**Diagnosis (from SEMrush Positions, Sep 13 2026):** ~84 keywords now ranking and the
trend is climbing, BUT nearly all sit at positions ~50-98 (page 5-10), so organic
traffic ≈ 0. The site is indexed and Google is testing it, but does NOT yet trust it
enough to rank page 1 (classic new-site / "sandbox" phase; site live ~Aug 2026).

**KEY INSIGHT:** The bottleneck is NO LONGER content (21 solid articles already rank).
Writing more articles will just add more page-5 rankings. The bottleneck is now
AUTHORITY (backlinks + trust + age). So the plan pivots:
- **Article cadence: SLOW to ~1-2/week** (was 5/week). Content base is enough for now.
- **New #1 priority = BACKLINKS** to push existing rankings from page 5→1.
- **#2 = refresh/improve articles already on page 2-3** (positions 11-30) — fastest ROI
  to reach page 1 (expand content, add FAQs, stronger internal links) — do this before
  writing brand-new pieces.
- **Internal linking:** keep strengthening (2-3 related articles + a calculator per post)
  to spread link equity.
- **Patience:** new-site page-1 breakthrough typically takes ~3-6 months; Aug→Sep is on
  track. Manage owner expectations — rankings will climb as authority builds.

**Backlink playbook (free / low-cost, US finance-appropriate; owner executes, agent
guides step-by-step in Hinglish):**
- **IMPORTANT:** HARO + Connectively were DISCONTINUED (Dec 2024). Use modern successors:
  Featured (formerly Terkel), Qwoted, SourceBottle, Help a B2B Writer, ResponseSource,
  Superpath's "source requests". Answer journalist queries → editorial backlinks Google respects.
- **Foundational profile/citation links (do first, quick wins):** Crunchbase, LinkedIn
  company page, Medium (republish w/ canonical), Quora + Reddit (genuinely helpful answers,
  link only where it fits — no spam), GitHub org, business directories/listings, About.me,
  Product Hunt-style listings where relevant.
- **Guest posts:** pitch small/mid US personal-finance blogs (not the Investopedia tier);
  offer a genuinely useful article with 1 contextual link back.
- **Digital PR / linkable asset:** publish an original data study or survey (e.g. a savings/
  debt/affordability stat roundup) that other sites cite → the highest-value links.
- **E-E-A-T support:** once real brand social profiles exist, add them to `config/site.ts`
  `social` with `confirmed:true` so `generateOrganizationSchema()` emits `sameAs` (see §8).
- **Never:** buy spammy PBN links, do link farms/exchanges, or over-optimize anchor text
  (mostly branded + natural anchors; YMYL site — a spammy profile can hurt).

**Backlink progress tracker (Batch A — foundational):**
- [x] Crunchbase — profile submitted (Sep 2026), PENDING Crunchbase review (404 until approved; normal).
- [x] LinkedIn Company Page — CREATED & live (Sep 2026). URL to be captured and added to
  `config/site.ts` social `sameAs` (E-E-A-T) once owner shares the page URL.
- [x] Medium — Rule of 72 republished WITH canonical to /news/rule-of-72 (Sep 2026). Live:
  medium.com/@varunattri3245/the-rule-of-72-how-to-quickly-estimate-when-your-money-doubles-1d819992e976
  (owner's Medium handle: @varunattri3245 — reuse for future republishes, always set canonical).
- [x] Quora — profile set (Writer at Coinscribed + bio with coinscribed.com). Account
  WARMED UP with 4 value-only answers (no link), incl. Rule of 72, good credit score,
  APR vs APY, mortgage APR vs APY (Sep 2026). Strategy for a NEW Quora account: post a few
  link-free helpful answers first, THEN start adding one natural contextual link per answer
  (avoids new-account link spam flags).
  **BAN-SAFETY (owner was rightly worried about a ban):** Quora links are nofollow anyway
  (value = traffic + brand signal, not SEO juice), so keep Quora SLOW/low-risk — don't force
  links. Plan: reach ~8-10 value-only answers spread over several days, let some upvotes
  accrue, and only ~1 week in add at most 1 natural link per every 3-4 answers (varied
  article URLs, never identical copy-paste). Put real backlink energy into DOFOLLOW sources
  (guest posts, Featured/Qwoted journalist links, directories) — that's the higher priority.
- [ ] (later) Reddit genuine answers, GitHub org, directories.
**Batch B (query-based) — DEPRIORITIZED:** Featured.com is now an AI-agent tool and Qwoted's
free/source UI doesn't expose journalist requests to respond to (both confusing for a new
solo source in 2026). Owner set up profiles on BOTH (Featured: Gmail login + finance-topic
profile; Qwoted: full profile — bio, #PersonalFinance/#Banking/#Mortgages/#CreditScore/
#Retirement, "coinscribed" publication + Writer work-experience). Those profiles = a small
brand-signal win; leave them and only engage if a clear journalist request appears. Do NOT
sink more time into these — they're not delivering easy links.
**NOW: Batch C — DIRECTORIES (in progress):** free, confusion-free, quick links. Consistent
NAP everywhere — Name: Coinscribed, URL: https://www.coinscribed.com, category Personal
Finance/Financial Services/FinTech, desc: "Coinscribed is a US personal finance publisher
offering free financial calculators and clear guides on banking, credit, mortgages, and
retirement."
**Directory progress:**
- [x] F6S — company profile LIVE & complete (logo + website URL). (Sep 2026)
- [x] Product Hunt — profile done; "Coinscribed" launch (link https://www.coinscribed.com/calculators)
  SCHEDULED (100% checklist complete, first comment added). Backlink goes public on launch date. (Sep 2026)
- [~] Crunchbase — submitted, PENDING review.
- [x] Owler — company profile LIVE with website link (Sep 2026).
- [x] Startup Ranking — startup submitted & LIVE (backlink live; ownership NOT claimed —
  owner has no @coinscribed.com email, and claim isn't needed for the link). (Sep 2026)
- [ ] blog directories — optional later.
**NOTE:** owner has NO brand email (@coinscribed.com) and NO Twitter/Facebook yet — skip any
backlink step that hard-requires those; they're not blockers.
**Also DONE:** LinkedIn Company Page confirmed in `config/site.ts` (confirmed:true) → Organization
schema now emits LinkedIn in `sameAs` (E-E-A-T). Owner's LinkedIn: linkedin.com/company/coinscribed.
Twitter/Facebook still confirmed:false (no real accounts yet).
**GUEST POSTS (strong dofollow) — IN PROGRESS.** Quality > quantity; AVOID "instant approval"/
paid link-farm sites (YMYL risk). Genuine target blogs (Tier 1 first): AskTheMoneyCoach
(askthemoneycoach.com/sponsored-article-submission-guidelines), Resourceful Finance Pro
(resourcefulfinancepro.com/write-for-resourceful-finance-pro), ElitePersonalFinance
(elitepersonalfinance.com/write-for-us, 1000-3000 words), CashLady UK (cashlady.com/write-for-us,
writeforus@cashlady.com), FangWallet (fangwallet.com/write-for-us-a-general-blog-post). Tier 2:
Fincover, Solvable. AVOID: fosburit, seolinkworld, ordnur, zetran (link-farm signals).
Pitch topics to offer (owner's strengths): How to Get Rid of PMI; The Rule of 72; APR vs APY;
How Much House Can I Afford (28/36). Flow: owner sends pitch (template on file) -> when a blog
says yes, AGENT writes the full original article with exactly ONE contextual backlink to a
relevant Coinscribed page, per that blog's guidelines. Pitch email uses owner name "Varun,
founder of Coinscribed" from personal email (no brand email yet).
**PITCHES SENT (Sep 2026), awaiting replies:** AskTheMoneyCoach (contact form — US personal
finance, byline link), CashLady UK (writeforus@cashlady.com — pitched UNIVERSAL topics: Rule
of 72, compound interest, emergency fund, debt payoff, since it's UK/FCA-reviewed; byline link),
FangWallet (albert@fangwallet.com, subject "Guest Post Opportunity" — sent samples + LinkedIn +
bio as required; up to 2 links). Replies take days — be patient. When a blog approves a topic,
AGENT writes the full original article to that blog's exact rules.
**IMPORTANT LEARNINGS:** (1) Backlink must be TOPICALLY RELEVANT — skipped Resourceful Finance
Pro (corporate/CFO/payroll audience, not consumer personal finance). (2) BEFORE pitching, verify
the blog ALLOWS a link — skipped ElitePersonalFinance: it pays $300/post but explicitly forbids
backlinks ("not an opportunity to obtain a link", "avoid promotional links"), so zero SEO value
(it's a paid-writing gig, not a link source). (3) Match topics to the blog's audience/region
(US topics like PMI/401k for US blogs; universal topics for UK/CashLady).
**FangWallet REPLY = PAID placement, not free guest post** (Sep 2026): quoted $100 1-yr / $150
permanent / $200 crypto, up to 5 dofollow links, pay-before-publish. DECISION: SKIP for now —
paid dofollow links carry Google/YMYL risk, one link won't move the needle, and budget is better
saved. Politely decline/ignore. LEARNING: many "guest post" sites are actually selling paid
placements under the guest-post label; prefer genuinely FREE editorial guest posts (AskTheMoneyCoach,
CashLady) that give a byline link. Only consider paid links later, from high-authority sites, with
budget and caution.
**Parallel:** identify articles on page 2-3 (positions 11-30) and improve them for fastest
page-1 push.


## 12. On-page SEO audit + improvements (Sept 2026)

**Context:** Positions check showed the site is still new — ~84 keywords ranking but almost all
at positions 50-98 (only 1 keyword in 21-50). So there's nothing on page 2-3 to "push" yet; the
real levers are authority (backlinks) + time + on-page polish. Ran a full on-page/technical audit.

**Already solid (do NOT re-flag):** sitemap (article lastModified is real via _updatedAt), robots,
per-page canonicals, one H1 per page, Article + BreadcrumbList + conditional FAQPage JSON-LD on
articles, HowTo+FAQ+Breadcrumb on calculators, Organization+WebSite on home, Person on author pages,
calculators have educational prose + FAQ + curated "related reading" links.

**DONE (PR #69):** (1) Article→calculator CTA is now TOPIC-aware — matches the article slug/title to
the best calculator (mortgage/PMI/house→mortgage, 401k→401k, roth→roth-ira, retirement→retirement,
credit card→credit-card-payoff, loan/debt/snowball/avalanche→loan-payoff, auto→auto-loan,
savings/HYSA/emergency→savings, apr/apy/cd/money-market→apy, compound/rule-of-72→compound-interest,
emi→emi, sip/dollar-cost/index-fund→sip), with per-category fallback and crypto→compound-interest.
Function `relatedCalculatorForArticle(slug,title,category)` in ArticleView.tsx. SAFE: all slugs exist
in data/calculators and RelatedCalculatorCard no-ops on unknown keys. (2) OG `modifiedTime` now emitted
(from _updatedAt). (3) Hero image alt now descriptive ("<title> — <category> guide").

**REMAINING on-page gaps (future, only if worthwhile):**
- Article↔article related is CATEGORY-ONLY (getRelatedArticles) — cross-category topic clusters
  (retirement/mortgage/banking span categories) don't auto-interlink. Proper fix needs a Sanity
  "relatedArticles" or "tags" field (schema currently has neither — see §6). Bigger change; defer.
- No JSON-LD (CollectionPage/ItemList/Breadcrumb) on category / news-listing / calculators-index pages.
- OG/Twitter images are conditional on article.imageUrl; calculator pages have no OG image / twitter card.
- Calculator educational prose is a bit thin for competitive YMYL terms (e.g. mortgage ~3 paras).
**Owner directive:** proceed with on-page/SEO improvements WITHOUT asking each time, but every change
must be traffic-positive and carry ZERO risk of negative SEO impact (no broken links, no canonical/
routing regressions, YMYL-safe).


---

## 13. Session log — 16 Sep 2026

### Admin editor: "Import from HTML" feature (SHIPPED, PR #74, merged to main)
The `/admin` article editor now has an **Import from HTML** button above the body editor so a
paste-ready HTML article can be dropped in at once (matches the SEO workflow of writing full
HTML). Files:
- `lib/html-to-editor-blocks.ts` — dependency-free HTML → `EditorBlock[]` converter. Supports
  `<p>`, `<h1>–<h6>` (h1→h2, h5/h6→h4), `<blockquote>`, `<ul>/<ol>`, `<table>` (→ existing
  `tableBlock`), inline `<strong>/<b>`, `<em>/<i>`, `<u>`, `<code>`, `<a href>`. Parse-only via
  `DOMParser`; strips script/style/iframe/form; **never stores or injects raw HTML**; reuses
  `genKey` and matches schema shapes exactly. Output is the SAME editor model the block editor
  produces, so it flows through `serializeBody` → Portable Text → `PortableTextRenderer`
  unchanged (TOC / reading-time / styling all keep working).
- `components/admin/HtmlImportDialog.tsx` — paste dialog, live block-count summary,
  append-or-replace choice.
- `components/admin/ArticleEditor.tsx` — button + dialog wired above `<RichTextEditor>`.
ARCHITECTURE NOTE (verified this session): article `body` is stored/rendered as **Sanity
Portable Text end-to-end** — NO HTML string field, NO `dangerouslySetInnerHTML`, NO markdown.
So the correct way to accept pasted HTML was to convert HTML → Portable Text at input time
(this feature), not to add an HTML field. tsc + lint + build all clean.

### SEO — next article picked & DATA-VERIFIED (ready to publish): "Difference Between Checking and Savings Accounts"
Full paste-ready HTML was delivered in chat + draft backup at
`.agents/drafts/article-22-checking-vs-savings.md`. Slug `difference-between-checking-and-savings-accounts`,
Category Banking, author Rachel Morgan, no year in title (evergreen rule).
DECISION (SEMrush data from Varun): the head term **"checking vs savings account"** (9.9K / KD 46 /
**Commercial** / CPC $7.01) was REJECTED — SERP owned by Tier-1 bank product pages (BofA, Chase Page
AS 30, Santander 135 ref domains, Investopedia Page AS 44). Wrong intent + too strong for a new site.
Instead the article targets the **informational** head "difference between checking and savings
accounts" (~590–1,300 vol, KD ~34–43) AND — for actual near-term traffic — a cluster of **green-KD
long-tails** as dedicated H2/H3 + FAQ sections: "is a debit card a checking or savings account"
(1,000 / KD 22), "which best describes the purposes…" (260 / KD 16), "is my account savings or
checking" (110 / KD 29), "how much to keep in checking vs savings" (140 / KD 28), "direct deposit
savings vs checking" (260 / KD 21), "how to transfer money from checking to savings" (140 / KD 26),
"can you have checks for a savings account" (210 / KD 28), "checking account for couples" (90 / KD 28),
"how do savings accounts work" (50 / KD 24). Internal links used (verified to exist):
`/calculators/apy-calculator`, `/calculators/savings-calculator`. Add contextual anchors to the HYSA
news article + CD-vs-HYSA article once those are confirmed live (skipped for now = zero broken links).
PENDING for Varun: paste the HTML into the /admin editor via the new Import from HTML button, set
featured image + SEO fields, publish, GSC index.


---

## 14. Session log — 16 Sep 2026 (part 2): GA4 clean-up + linkable-asset data study

### DATA CONFIRMED the authority phase (GA4 + GSC, ~19 Aug–15 Sep 2026)
Owner shared GA4 + GSC screenshots. Reality check, all consistent with §11:
- GA4: 55 active users / 28 days, avg engagement 2m17s (good), but traffic is mostly
  INTERNAL — top page = **/admin (158 views)**, top city = **Gurugram (owner)**, channel
  Direct 60 vs Organic 14. Real organic is tiny.
- GSC: **~3 total web search clicks** over ~9 days. Impressions climbing but everything is
  page 5-10 (positions 50-98). So STILL nothing on page 2-3 to "refresh-and-push" yet —
  the lever remains BACKLINKS + time, exactly as §11 says. Manage expectations accordingly.

### SHIPPED (PR #76, merged to main)
1. **GA4 internal-traffic exclusion** — `components/analytics/GoogleAnalytics.tsx` is now a
   `'use client'` component using `usePathname()`; it returns null (loads NO gtag) on
   `/admin`, `/studio`, `/preview` (EXCLUDED_PREFIXES). Stops owner/CMS visits polluting GA4.
   NOTE for owner: also worth setting a GA4 "internal traffic" filter / defining internal
   traffic by IP in GA4 admin for belt-and-suspenders, but the code guard already removes the
   biggest offender (admin page views).
2. **Home Affordability Index** — new static page **`/home-affordability-index`** = the
   original data-study "linkable asset" §11 called for (highest-value dofollow backlink
   magnet; had NOT been built before). Ranks 30 US metros by household income needed to
   afford the median home under the 28% front-end rule. Data + math in
   `data/affordability-index.ts`; uses the SAME amortization formula as the mortgage
   calculator so study and tool agree. All numbers COMPUTED from stated assumptions (20%
   down, 30-yr @ 6.5%, +1.25%/yr tax+ins, 28% DTI, median prices labeled as approximate
   benchmarks) — nothing fabricated (YMYL-safe). Has Dataset JSON-LD, suggested-citation box,
   internal links to mortgage-calculator + how-much-house-can-i-afford, and a sitemap entry
   (HUB_PRIORITY, monthly). Spot-checked: San Jose ~$392K, Dallas ~$105K, Detroit ~$57K = realistic.

### NEXT BACKLINK STEP (owner action) — promote the data study
The asset only earns links once it's PITCHED. Plan for next session / owner:
- Pitch the Home Affordability Index to journalists (Featured/Qwoted when a real request
  appears) and to small/mid US personal-finance + real-estate blogs as a citeable stat source.
- Add it to the Medium republish rotation (with canonical) and mention in genuine Quora/Reddit
  answers about "income needed to buy a house in <city>" (natural, non-spam).
- Once real brand social accounts exist, keep `config/site.ts` social `confirmed:true` in sync.
Refresh track stays PARKED until GSC shows an article reach positions 11-30 (page 2-3);
owner should re-share GSC Pages (avg position) in a few weeks to spot the first climber.


---

## 15. Session log — 16 Sep 2026 (part 3): Email connectivity (contact form + brand email)

### SHIPPED (PR #78, merged) — Contact form
Visitors can now email the site. Mirrors the newsletter pattern exactly (no email provider
needed to function):
- `sanity/schemas/contactMessage.ts` (+ registered in `sanity/schema-index.ts`): new
  `contactMessage` doc (name, email, subject?, message, receivedAt, source), newest-first.
  Owner reads/replies from Studio/admin.
- `app/api/contact/route.ts`: validates, drops honeypot spam (`company` field), stores via
  server-only `SANITY_WRITE_TOKEN`; honest 503 when token unset (UI shows the mailto instead).
- `components/contact/ContactForm.tsx`: accessible client form + honeypot; success only on
  confirmed store.
- `app/(site)/contact/page.tsx`: static `/contact` page + mailto fallback. Added Contact to
  footer `company` nav and to the sitemap.
- `config/site.ts`: NEW single-source `contactEmail` = `hello@coinscribed.com` (placeholder
  until the real mailbox exists — UPDATE it there when the brand mailbox is created).

### EXISTING (unchanged) — Newsletter
`/api/newsletter` + `NewsletterSignup` + `subscriber` schema already exist and work; both
the newsletter AND the new contact form need **`SANITY_WRITE_TOKEN` set in Vercel** to store
submissions (else 503). Owner action: add that env var (editor-scoped token from
manage.sanity.io -> API -> Tokens).

### BRAND EMAIL @coinscribed.com — RECOMMENDED, owner to create via Hostinger
Site already references `privacy@coinscribed.com` and `legal@coinscribed.com` (privacy/terms
pages) as mailto links, so a real mailbox should exist. It also professionalizes guest-post
pitches + unblocks directories that want a brand email (§11 noted the owner had none). Owner
said he'll buy/create it on Hostinger. Recommended addresses: `hello@coinscribed.com` (primary,
already the config default), plus catch-all or aliases for `privacy@` and `legal@`. Steps given
in chat (Hostinger hPanel -> Emails -> create mailbox; or free Zoho Mail with MX/SPF/DKIM DNS
records). ONCE CREATED: update `siteConfig.contactEmail` if different from hello@, and it's a
good time to add real Twitter/Facebook accounts (still `confirmed:false`) for E-E-A-T `sameAs`.


---

## 16. Brand email LIVE + PENDING: inbox email notifications (Resend)

### DONE (PR #80, merged) — brand email unified
Owner created the real mailbox **varun@coinscribed.com** (bought via Hostinger). All contact
points now use it via `siteConfig.contactEmail` (single source of truth in `config/site.ts`):
contact page, privacy-policy, terms-of-service, disclaimer (replaced the old hardcoded
hello@/privacy@/legal@ mailtos). To change the site's contact email ever again, edit ONLY
`config/site.ts` `contactEmail`.

### PENDING (owner deferred to "kal"/next session) — send form submissions to the inbox
CURRENT BEHAVIOUR: the contact form (and newsletter) STORE to Sanity only — they do NOT email
varun@coinscribed.com, because a website can't send email without an email-sending service
(Resend/SendGrid/Mailgun/SMTP) + API key, which isn't set up yet. Owner asked "why not straight
to my inbox" — explained the reason; owner wants it but said not tonight ("kal karte hain, abhi
mann nahi hai").

PLAN FOR NEXT SESSION — add Resend so form submissions ALSO arrive in the inbox (keep Sanity as
backup = best of both):
1. Owner: create free Resend account (resend.com, Gmail login; free tier ~3,000 emails/mo).
2. Owner: verify domain coinscribed.com in Resend -> add the 2-3 DNS records (SPF/DKIM/MX-ish)
   in Hostinger DNS (agent will give exact records from Resend's dashboard).
3. Owner: create a Resend API key -> add to Vercel env as e.g. RESEND_API_KEY.
4. Agent: `bun add resend`, then in `app/api/contact/route.ts` (and optionally
   `app/api/newsletter/route.ts`) after the successful Sanity write, send a notification email
   TO varun@coinscribed.com FROM a verified sender (e.g. noreply@coinscribed.com) with the
   submission + reply-to set to the visitor's email so "Reply" goes straight to them. Must be
   best-effort/non-blocking: if the email send fails, the Sanity store still succeeds and the
   user still sees success (never regress the working form). Guard on RESEND_API_KEY presence
   so it no-ops cleanly when unset (same honest pattern as SANITY_WRITE_TOKEN).

ALSO STILL PENDING (owner action, unrelated to Resend): set **SANITY_WRITE_TOKEN** in Vercel so
BOTH the contact form and newsletter actually store submissions (else they 503). This is the
prerequisite for the forms working at all; Resend is the enhancement on top.


---

## 17. Session log — 16 Sep 2026 (part 4): GSC-driven organic strategy + auto-loan SEO

### BIG GSC INSIGHT (3-month Performance data from owner)
The site's #1 impression-earner is **/calculators/auto-loan-calculator = 638 impressions, 0 clicks,
avg position ~80 (page 8)**. Google surfaces it for queries it only PARTLY matches:
'negative equity car loan calculator', 'balloon payment calculator', 'car loan with negative
equity', 'auto finance estimator', 'car finance with balloon calculator', 'refinance balloon
payment calculator', etc. Other high-impression pages: /news/what-is-a-good-credit-score (359),
/news/simple-vs-compound-interest (147), /news/401k-employer-match-explained (98, 1 click),
/news/what-is-apr (59). Total site clicks are still ~0-3 = authority phase confirmed again.

### SEMrush verdict on the auto cluster (data-first)
- `auto loan calculator` — 550K vol, **KD 85** -> UNWINNABLE now (Bankrate 277 ref domains,
  calculator.net 553, BofA, NerdWallet). Do NOT chase the head term.
- `auto refinance calculator` — 8.1K, **KD 55** (needs ~122 ref domains) -> later.
- `balloon payment calculator` — 1.9K, **KD 49**, more mortgage than car -> secondary.
- **`negative equity car loan calculator` — 590 vol, KD 32 (GREEN), SERP GAP (Reddit #6 with 0 ref
  domains, carcalcpro/autopayplus 0 ref domains) -> THE WINNABLE ANGLE.** Green cluster: 'car loan
  calculator with negative equity' (KD 27), 'car with negative equity calculator' (KD 31), 'car
  loan calculator negative equity' (KD 45). This is exactly what the auto-loan page already ranks
  (badly) for.

### SHIPPED (PR #83, merged) — auto-loan calculator SEO deepening
Enhanced /calculators/auto-loan-calculator for the negative-equity/balloon cluster (content + FAQ
ONLY; calculator inputs/formula/results untouched): rewrote the 'underwater' section as 'Negative
equity: when you're underwater on a car loan' with the explicit term + worked example ($22k owed vs
$18k value = $4k); added a 'Balloon payments on car loans' section; added 3 FAQs (feed FAQPage
schema); wove negative equity + balloon into the intro (CalculatorLayout description) and the
listing-card description (data/calculators.ts). Goal: lift from ~page 8 toward the KD-32 niche.

### NEXT STEPS (organic-growth roadmap, agreed direction)
1. **Dedicated article** targeting `negative equity car loan calculator` (KD 32) + green cluster,
   internal-linking to the auto-loan calculator (pillar+cluster). Highest-intent winnable target.
2. Refresh titles/meta of the other high-impression pages (what-is-a-good-credit-score 359 imp
   for 'credit score range' queries; simple-vs-compound-interest 147 for 'difference at 10%' Qs).
3. Keep BACKLINKS as the real lever (authority phase) + promote the Home Affordability Index asset.
4. Recheck GSC in a few weeks for any page hitting positions 11-30 (then refresh-to-push).
REMINDER: everything data-first — get SEMrush Volume/KD/SERP before writing any new article.


---

## 18. Backlink target list + pitch templates (researched 16 Sep 2026)

Agent web-researched genuine, YMYL-safe, mostly-free targets (filtered OUT link-farm/paid-no-link
sites: ElitePersonalFinance=pays but forbids links, fosburit/ordnur/linkpublishers=link-farm signals,
FangWallet=paid placement confirmed earlier). Owner pitches from varun@coinscribed.com.

### A) GUEST-POST targets (free / byline link) — pitch with Template 2
- RealEstateAgent.com — realestateagent.com/real-estate-blogger.html (home affordability angle)
- List With Clever — listwithclever.com/write-for-real-estate-blog (how-much-house-can-i-afford)
- Realtor.com resource hub — realtor.com/marketing/resources/call-for-contributors (agent audience, high authority)
- First Heritage Mortgage — fhmtg.com/guest-blog-posts (homeownership/PMI = perfect topical fit)
- Lazy Man and Money — lazymanandmoney.com/guest-post-guidelines (Rule of 72 / compound interest)
- Man vs Debt — manvsdebt.com/guest-post-guidelines (debt snowball/payoff)
- Credit Suite — creditsuite.com/blog/guest-blogger-guidelines (credit score)
- CashLady (UK) — writeforus@cashlady.com (ALREADY pitched Sep 2026 — follow up)
WORKFLOW: owner pitches -> when a blog says yes, AGENT writes the full original article to that
blog's exact rules with exactly ONE natural contextual link back to the relevant Coinscribed page.

### B) JOURNALIST-REQUEST platforms (best for the Home Affordability Index = free editorial DOFOLLOW)
- SourceBottle — sourcebottle.com (100% free; sign up, set finance/real-estate/property alerts)
- Source of Sources (SOS) — sourceofsources.com (free HARO successor, high volume)
- Featured.com — profile already exists (owner) — "less is more", 1-2 quality answers
- Qwoted — profile already exists (owner) — higher-authority outlets
STRATEGY: when a journalist asks about "housing affordability / income needed to buy a home /
mortgage / cost of living", answer with a stat FROM the Home Affordability Index + link to
https://www.coinscribed.com/home-affordability-index. Editorial dofollow link = highest value.

### PITCH TEMPLATES (paste-ready, send from varun@coinscribed.com)
DATA-STUDY pitch — Subject: "Data: income needed to buy a home in 30 US cities (free to cite)"
Body: intro (Coinscribed, US personal finance) + 2 findings (San Jose ~$392K vs Detroit ~$57K, 6x+
gap; ranked table + transparent methodology) + "cite any of it with a link:
https://www.coinscribed.com/home-affordability-index" + offer a custom city stat + sign "Varun,
Founder, Coinscribed, varun@coinscribed.com".
GUEST-POST pitch — Subject: "Guest post idea for [Blog]: [topic]" — praise the blog's style, offer
1,000-1,500-word original topics (How to Get Rid of PMI / APR vs APY / Rule of 72), promise exactly
ONE natural relevant link per their guidelines, ask if it fits their calendar; same signature.

### PRIORITY ORDER
#1 (fastest dofollow): sign up SourceBottle + Source of Sources, set finance/real-estate alerts,
answer with Home Affordability Index data. #2: guest-post pitches to First Heritage Mortgage (PMI),
Lazy Man and Money, Man vs Debt. #3: follow up CashLady. Keep it slow/quality (YMYL) — a few great
placements beat volume.


---

## 19. Backlink execution progress (16 Sep 2026 eve) + email-to-Gmail

### Brand email varun@coinscribed.com — receiving works
- Mailbox is on HOSTINGER (Starter Business Email trial, expires 2026-10-16, 5GB, Active).
- Owner ADDED it to the phone Gmail app (IMAP) = DONE, mail now lands on his phone. Good enough.
- Hostinger server settings (for reference / laptop setup later): IMAP imap.hostinger.com:993 SSL,
  SMTP smtp.hostinger.com:465 SSL, POP pop.hostinger.com:995 SSL, user varun@coinscribed.com.
- PENDING (optional, owner said "kal"/later): also add it to Gmail on Chrome/desktop —
  Settings > Accounts and Import > "Check mail from other accounts" (POP3, pop.hostinger.com:995
  SSL) to RECEIVE, and "Send mail as" > Add another email (smtp.hostinger.com:465 SSL) to SEND-AS.
  Owner's personal Gmail is varunattri98@gmail.com. Not urgent — phone works.

### Backlink platforms status
- SourceBottle — ACCOUNT + free EXPERT PROFILE created and PUBLISHED (status LIVE) under
  varun@coinscribed.com. Profile: Varun Attri, Founder Coinscribed, US, keywords personal
  finance/mortgages/home affordability/credit/banking, website coinscribed.com, LinkedIn linked.
  Owner should check the "Drink Up!" alert emails and answer finance/property callouts with a
  Home Affordability Index or calculator link.
- Featured.com / Qwoted — owner has (or is creating) profiles; wanted to make the Featured account
  under varun@coinscribed.com (don't duplicate an old one — use one).
- An aggregator dashboard (showed Qwoted+HARO+Connectively together, "Media Opportunities", 40
  mortgage/finance journalist requests) could NOT send emails from within it — plan: respond on the
  ORIGINAL platform (qwoted.com login) instead.

### TWO high-value journalist requests PENDING a reply (both ~2 days left as of 16 Sep, on Qwoted)
Agent already WROTE both answers (owner just needs to paste + submit on qwoted.com):
1. USA TODAY — mortgage lender piece on credit score + DTI to secure a loan (580-620 most, 700
   jumbo). Answer covers 620 conventional / 580 FHA / 700+ jumbo + 28/36 DTI (43-45% conv) + the
   "cross 670 before applying" tip, signed Varun Attri, Founder Coinscribed, coinscribed.com.
2. The Playbook (Morning Brew) — how mortgage experts personally shopped for their mortgage / snag
   a low rate. Answer: shop 3-5 lenders in a 2-week window (one credit pull), buy points only past
   break-even, optimize score/utilization pre-apply, negotiate lender fees, APR>rate. Same signature.
SKIP: Dreamy Leads (needs licensed NMLS originator — owner isn't, don't fake it) and MoneyLion
(needs a mortgage broker). YMYL honesty.

### NEXT (backlink to-do, resume here)
1. Owner: paste the 2 answers on qwoted.com before they expire; check SourceBottle alerts.
2. Send 3 guest-post pitches (Template 2): First Heritage Mortgage (fhmtg.com/guest-blog-posts,
   PMI), Lazy Man and Money, Man vs Debt. When any says yes, AGENT writes the full article w/ 1 link.
3. Promote Home Affordability Index as the citeable asset in every journalist answer.


---

## 20. Tuesday article WRITTEN — Negative Equity Car Loan (data-verified, 16 Sep 2026)

Full paste-ready HTML delivered in chat; raw data + full brief backed up in
`.agents/drafts/article-23-negative-equity-car-loan.md` (includes the complete SEMrush Overview +
Magic Tool + SERP raw data, decision logic, sources).

- **Slug:** negative-equity-car-loan | **Category:** Banking | **Author:** Ethan Caldwell
- **Title:** Negative Equity Car Loan: What It Is and How to Get Out
- **SEO Title:** Negative Equity Car Loan: What It Is & How to Get Out
- **Meta (157):** Negative equity means you owe more on your car than it's worth. Here's how to
  calculate it, why it happens, and the smartest ways to get out from underwater.
- **Excerpt:** Owe more on your car than it's worth? That's negative equity — being "upside down"
  on your loan. Here's how to calculate it, why it happens, and how to get out.
- **Featured image:** owner made an on-brand Canva graphic (underwater car, Loan Balance $28,000 vs
  Car Value $20,000, oxblood accent) — excellent. ALT: "Negative equity car loan illustration — a
  car underwater showing a $28,000 loan balance against a $20,000 car value".

### WHY (data-verified pick, not guesswork)
- Primary kw **negative equity car loan calculator**: Vol 590, **KD 32 (green/winnable)**, Informational.
- Green cluster: car loan calculator with negative equity (KD 27), car with negative equity calc (KD 31).
- SERP GAP: Bankrate/Edmunds/NavyFed/USNews on top BUT positions 6-9 = Reddit (0 ref domains),
  carcalcpro (0), autopayplus (0) + thin/local dealer blogs = beatable.
- REJECTED head terms: auto loan calculator (KD 85), auto refinance (KD 55), balloon payment (KD 49).
- Pillar+cluster: internal-links to /calculators/auto-loan-calculator (which already earns 638 GSC
  impressions on neg-equity/balloon queries at avg pos ~80) to lift that whole cluster. Also links
  /calculators/loan-payoff-calculator and /news/how-to-pay-off-a-loan-faster (all verified to exist).

### Content quality bar met
Unique (written from scratch), informative + data-backed (FTC citation; Edmunds Q1-2026 stat: >3 in
10 trade-ins underwater, avg ~$7,183), human tone (no AI clichés — delve/seamless/furthermore
avoided), GEO-optimized (Quick Answer box + 7 FAQs + exact-match headings for green-KD queries).
Honest ranking expectation set with owner: content is page-1-worthy + winnable (KD 32 + SERP gap),
but the site is still in the authority phase, so ranking = content (done) + BACKLINKS + time (~2-4 mo).

### PENDING for Varun
Paste via /admin Import-from-HTML, set all fields, upload the featured image + alt, Publish, then
GSC Request Indexing for https://www.coinscribed.com/news/negative-equity-car-loan.


---

## 21. Big session — internal linking + GEO + backlink blitz (16 Sep 2026)

### SHIPPED CODE (PR #88, merged) — internal linking + GEO
- Fixed `relatedCalculatorForArticle` in components/news/ArticleView.tsx: moved the auto/car rule
  ABOVE the generic loan-payoff rule + added keywords (negative equity, upside down, underwater,
  car payment, auto/car finance) so car-loan articles map to the auto-loan calculator (not
  loan-payoff). This makes the new Negative Equity article point at the auto-loan calculator.
- Linked 4 previously-orphaned live articles from calculators (all slugs verified live in sitemap =
  zero broken-link risk): apy -> cd-vs-high-yield-savings-vs-money-market; savings ->
  how-to-save-for-a-down-payment; mortgage -> how-much-house-can-i-afford + how-to-save-for-a-down-payment.
- GEO: generateArticleSchema (lib/schema-markup.ts) now emits a `speakable` SpeakableSpecification
  (h1 + [data-speakable="key-takeaways"]); KeyTakeaways.tsx carries that data attribute.
- Confirmed: all 16 existing + 4 new calculator relatedReading slugs exist in the live sitemap
  (sub-agent flagged a theoretical broken-link risk but actual check = all clean).

### BACKLINK OUTREACH — 8 actions today (Tier-1 + assets)
Owner sends from varun@coinscribed.com. Content = agent's job; when a blog says yes, AGENT writes
the full article with 1 natural link.
GUEST-POST PITCHES SENT (awaiting reply, 3-10 days):
1. First Heritage Mortgage (fhmtg.com/guest-blog-posts contact form) — PMI topic. Their rules:
   original, casual/no-jargon, 1 dofollow link to us + they add 2-3 internal links, they keep
   editorial rights, exclusive. GOOD fit.
2. Lazy Man and Money (contact form) — Rule of 72 / simple-vs-compound. Selective/SEO-averse blog,
   low odds, but sent (community-friendly pitch).
3. Man vs Debt (Baker@ManVsDebt.com) — debt snowball / pay off loan faster. Older blog, low odds.
GUEST ARTICLE SUBMITTED (full 1,050-word piece, not just pitch):
4. AskTheMoneyCoach — "Debt Snowball vs Debt Avalanche" full article (real Fed/TransUnion data:
   ~21% avg APR, ~$6,600 avg balance, $1.28T total). Draft saved
   .agents/drafts/guest-post-askthemoneycoach-debt-snowball-vs-avalanche.md. Bio has 1 dofollow to
   coinscribed.com. Rules met: 800+ words, FAQ, original.
5. The Small Investor (smallivy.com form) — pitched "Simple vs Compound Interest" (free, up to 3
   links, but they reject SEO-firm/spam, so pitched as genuine blogger).
6. Guide to Money (kevin@guidetomoney.com) — pitched "Negative Equity Car Loans" (100K readers,
   free, dofollow, 1,500-2,500 words).
ASSETS PUBLISHED (LIVE now):
7. issuu — Home Affordability Index PDF LIVE: issuu.com/coinscribed.com/docs/the_home_affordability_index_income_needed_to_bu
   (Basic/free plan; do NOT pay for issuu Teams). Description links coinscribed.com/home-affordability-index.
8. Medium — Home Affordability Index republished LIVE via "Import a story" (auto-canonical to the
   coinscribed original, so no duplicate-content harm): medium.com/@varunattri3245/how-much-income-do-you-really-need-to-buy-a-home-in-america-30-cities-ranked-e38711665d64
   Draft/notes: .agents/drafts/medium-home-affordability-index.md.
QUORA (account warm): 2 genuine answers posted (credit score simulator Q; "$650k house income" Q
with Home Affordability Index link). Quora links are nofollow = referral/brand/GEO value.
REDDIT (owner's old personal account): 1 VALUE-ONLY answer (no link) on an r/personalfinance
401(k)-loan-for-down-payment thread — building credibility first; add links only later, sparingly.

### VERIFIED TARGET RESEARCH — SKIP LIST (agent read the actual guidelines; do NOT waste time)
- PAID (skip): ElitePersonalFinance ($300 but forbids links), DebtHelper ($74 donation), FangWallet.
- CREDENTIAL-GATED (skip, owner isn't a CFP/CPA/attorney/MLO): Due.com (also nofollow), CuraDebt.
- NOFOLLOW / low value: Credit Suite (B2B + nofollow), Think Save Retire (nofollow risk).
- RECIPROCAL LINK (Google link-scheme risk, skip): RealEstateAgent.com.
- DEAD/HACKED (skip, now a gambling site): financialfreedomnow.org.
- LINK-FARM/spam (skip, YMYL penalty risk): fosburit, ordnur, laptopspapa, fincover, prposting, jootoor.
- HOLD until we have 3 live guest samples: List With Clever (needs 3 external writing samples).
- Money Saving Mom = genuine but effort-heavy (needs full budget-topic article) — later.
- CashLady = confirmed PAID earlier — skip.
KEY LESSON reaffirmed with owner: genuine FREE + dofollow + YMYL-safe + relevant guest blogs are
SCARCE (~15% of "write for us" pages). Do NOT chase 20 blindly — spam/link-farm links can PENALIZE
a YMYL site. Quality > volume. Authority = MULTIPLE channels (guest posts + journalist platforms +
Reddit/Quora + published assets like issuu/Medium) + consistency over WEEKS, not a one-day blitz.

### NEXT SESSION / TO-DO
- Check email (varun@coinscribed.com) for guest-post replies -> when any says yes, AGENT writes the
  full original article with exactly 1 natural link.
- SourceBottle "Drink Up!" alerts: profile LIVE + filtered to US + Business&Finance + Property; when
  a finance/mortgage/housing callout arrives, agent writes the answer (+ Home Affordability Index link).
- Drip 2-3 NEW verified genuine guest targets per week (agent reads guidelines first).
- 1-2 fresh Quora/Reddit answers per day max (spam-safe); Reddit stays value-first until warmed.
- Publish the Negative Equity Car Loan article (draft ready) via /admin Import-from-HTML + GSC index.
- Guide to Money / AskTheMoneyCoach / Small Investor: if accepted, agent writes to their exact rules.


---

## 22. GSC indexing audit + www canonical fix (17 Sep 2026)

### SHIPPED (PR #90, merged) — canonical www host
GSC "Why pages aren't indexed" showed **13 pages as "Redirect error"** — all APEX URLs
(coinscribed.com/calculators/*, /news/401k-vs-roth-ira). Root cause: `config/site.ts` had
`url: 'https://coinscribed.com'` (apex), so sitemap + canonicals + robots + JSON-LD + OG all
emitted apex URLs, and the apex 308-redirects to www → Google hit a redirect on every URL and left
them unindexed. FIX: set `siteConfig.url` and `ogImage` to `https://www.coinscribed.com` (single
source of truth; app/sitemap.ts, app/robots.ts, lib/schema-markup.ts all derive from it). Verified
no source file hardcodes the apex anymore. tsc/lint/build clean. Owner then clicked "Validate Fix"
on the Redirect-error issue in GSC and re-submitted the sitemap.

### GSC indexing status (17 Sep 2026): 31 indexed / 119 not indexed — the 4 reasons, DECODED
- **Redirect error (13)** → FIXED via PR #90 (was apex→www redirect). Validate Fix clicked. Should index after re-crawl.
- **Page with redirect (2)** = http://coinscribed.com/ and https://coinscribed.com/ → NORMAL (http→https + apex→www). NOT an error, ignore. Never click Validate Fix on this.
- **Discovered – currently not indexed (102)** = mostly the bank-routing pages (thin/similar) → NORMAL for a new low-authority site; Google deprioritizes them. Fix = authority (backlinks) + time, NOT a code change. Do NOT click Validate Fix.
- **Crawled – currently not indexed (2)** → NORMAL, will index with time/authority.
RULE: only "Redirect error" was a real fixable issue. The 104 "discovered/crawled - not indexed"
are the new-site trust gap — the www fix helps future crawls, but the real lever remains
backlinks + time (do not keep re-validating these; that's not how they clear).

### STILL PENDING (owner action, next session)
- GSC → Security & Manual Actions → Manual Actions: confirm "No issues detected" re: the spam/PBN
  backlinks (rankbacklink.shop, casino .online domains, "buy backlinks/PBN" anchors) that a
  bot/scammer is auto-generating at coinscribed.com. Mostly nofollow; Google usually ignores
  automated spam. If a manual action or a growing dofollow-spam pattern appears, build a GSC
  disavow file. NEVER pay any "buy backlinks/PBN" service (that's the same spam).
- Check email for guest-post replies; publish the Negative Equity article; recheck GSC in a few
  days to confirm the 13 redirect pages indexed.


---

## 23. Session — Balloon article + full audit + auto-cluster linking + backlinks (21 Sep 2026)

### Article #24 WRITTEN & SCHEDULED — Balloon Payment Car Loan
Full paste-ready HTML delivered in chat; backup at `.agents/drafts/article-24-balloon-payment-car-loan.md`.
- **Slug:** balloon-payment-car-loan | **Category:** Banking | **Author:** Ethan Caldwell
- **Title:** Balloon Payment Car Loan: What It Is and How It Works | **SCHEDULED Wed 23 Sep 8 AM ET**
- DATA-VERIFIED PICK (SEMrush from Varun): primary kw `balloon payment car loan` Vol 110 / **KD 29 (green/easy)** / Informational. SERP GAP = 1cfcu.org (2 ref domains!), Reddit, small credit unions = beatable. Chosen OVER `balloon payment calculator` (Vol 1.9K but KD 49 + Bankrate 644 ref domains + calculator-tool intent = hard).
- Magic Tool (seed "balloon payment car"): captured general-definition cluster too — `define balloon payment` (590), `balloon payment definition` (1,300), `balloon loan` (2,400), plus questions (how does a balloon payment work 320, what are balloon payments on cars 110, can you finance a balloon payment 110). STRATEGY: car-focused primary + a "What is a balloon payment?" definition section to capture the higher-volume general cluster in one article.
- Structure: Quick Answer GEO box, definition, how-it-works, example table, balloon-vs-traditional table, pros/cons, end-of-term options, refinance, 7 FAQs. Internal links: /calculators/auto-loan-calculator + /news/negative-equity-car-loan + /calculators/loan-payoff-calculator.
- Featured image: owner made Canva graphic (car tied to a $ balloon + coin-stack timeline). ALT: "Balloon payment car loan illustration showing low monthly payments followed by one large final lump-sum payment."
- PENDING: publishes automatically Wed; then GSC Request Indexing https://www.coinscribed.com/news/balloon-payment-car-loan.

### 3 scheduled articles pipeline (car-loan cluster forming)
- Mon 21 Sep: Difference Between Checking and Savings (checking-vs-savings)
- Tue 22 Sep: Negative Equity Car Loan (negative-equity-car-loan)
- Wed 23 Sep: Balloon Payment Car Loan (balloon-payment-car-loan)
Tue+Wed = car-loan cluster, interlinked with auto-loan calculator = pillar+cluster.

### FULL SITE AUDIT (21 Sep) — verdict: site is in AUTHORITY phase, on-page is DONE
- **Technical SEO = excellent, nothing to fix:** sitemap.ts + robots.ts proper; canonical www fixed (PR #90); schema-markup.ts emits Article, FAQPage, HowTo, Breadcrumb, Organization, WebSite, Speakable (GEO-ready); internal linking clusters set. Do NOT keep "fixing" on-page — it's pro-level already.
- **Content = sufficient:** ~24 articles + 14 calculators + Home Affordability Index asset + bank-routing pages. Do NOT pump more articles (5/wk); slow to 1-2/wk.
- **GSC current stage (3-month):** Impressions 4.02k and RISING (good), Avg position **63.5 (page 6-7)**, Clicks 3, everything page 4+. Classic new-site trust gap (site live ~Aug 2026, ~1.5 months old).
- **DIAGNOSIS:** content ✅ + technical ✅ + indexing ✅. The ONLY missing lever = AUTHORITY (backlinks + trust + time). No magic on-page fix will move page 6→1; it's backlinks + time (3-6 months typical).

### GSC QUERIES — 3 clusters identified (all clicks=0, i.e. page 4+, but shows what Google finds relevant)
1. **AUTO/CAR LOAN = strongest** (loan calculator auto 33, balloon payment finance calculator 28, negative equity calculator 26, negative equity car loan calculator 23, car balloon payment calculator 22, refinance balloon payment calculator 21, car loan calculator 20, + 15 more). Our balloon + negative-equity articles + auto-loan calc target this exactly.
2. **CREDIT SCORE** (credit score range 27, what is the credit score range 23, is-XYZ-a-good-credit-score many, fico score range 11). Candidate new article: "credit score range" (needs SEMrush data first per the mandatory rule).
3. **APR/APY/INTEREST** (what is apr 35 = highest single query, compound interest calculator 20, apy calculator 20, simple vs compound 23, what is apy 19, apr vs apy 12).
NOTE: nothing is on page 2-3 yet (all page 4+), so "refresh a page-2 article" still not applicable; lever stays backlinks + time.

### SHIPPED PR #92 (merged) — auto-cluster internal linking strengthened
- auto-loan-calculator/page.tsx relatedReading: ADDED /news/negative-equity-car-loan + /news/balloon-payment-car-loan (placed first as most relevant; kept existing 3). loan-payoff-calculator/page.tsx: ADDED /news/negative-equity-car-loan.
- Article→calculator direction already correct via ArticleView.relatedCalculatorForArticle() (untouched). Now bidirectional: balloon ⇄ auto-loan calc ⇄ negative-equity, + loan-payoff calc. Additive-only, all slugs confirmed, tsc/lint/build clean, CI passed, squash-merged. Rationale: pass internal authority within the #1 impression cluster so it climbs page-1 together.

### BACKLINKS this session (authority phase = #1 lever)
- **Reddit:** posted a VALUE-ONLY (no link) answer on r/personalfinance "smartest way to pay off car loan?" (3d-old, US, non-archived) — owner's personal account, warm-up only (Varun correctly noted personal-account+no-link = ~0 direct SEO value; it's just account warming, low priority).
- **Guest pitch SENT:** Wealth of Geeks (social@wealthofgeeks.com) — offered "Balloon Payment Car Loans" / "Negative Equity" pieces. Awaiting reply (3-10 days); when yes, AGENT writes full original article + 1 dofollow link.
- **Quora:** posted 2 fresh answers today (total now 5): (1) "Does APR affect monthly payments?" → link /news/what-is-apr; (2) "If I overpay my credit card balance, will my score improve?" (utilization/timing angle) → link /news/what-is-a-good-credit-score. Both links LIVE. Quora links nofollow = referral/brand/GEO value. Rule: 1-2/day max, value-first, consumer-finance Qs only.
- **VERIFIED GUEST SKIP LIST (checked live this session — do NOT re-try):** DollarSprout (no write-for-us page, partners@=paid), Partners in Fire (no public page, blind pitch), Savoteur (TRAVEL niche + no page), Advisor Perspectives (audience = RIAs/advisors + investment-strategy, credential tone — mismatch), MoneyGeek (expert-quote model needs Harvard/PhD/CFP-tier credentials, not a guest-post/link model; contact myla@moneygeek.com if ever), Well Kept Wallet + Good Financial Cents + DoughRoller + Money Crashers + Penny Hoarder + SavingAdvice + Financial Pilgrimage + Money Done Right (write-for-us pages DEAD/redirect/404 — many finance sites removed guest pages post-2024 spam updates). KEY LESSON REINFORCED: genuine free+dofollow+YMYL-safe+relevant finance guest blogs are now VERY scarce (well under 15%); 10 free guest posts in a day is NOT realistic; forcing the number = spam/paid sites = negative-SEO risk. Quality drip (1-2 genuine/week) + journalist platforms + Quora/Reddit + published assets over WEEKS is the real path.

### Qwoted status (journalist links = strongest for YMYL, but blocked today)
- Owner's OLD Qwoted account was suspended; made a NEW one, but it registered as "Journalist/Reporter" role → error "Reporters cannot view other reporters' requests." FIX (deferred to next session by owner): Qwoted Settings → switch Account type from Journalist/Reporter to Expert/Source. Then answer finance journalist requests.
- Media-Opportunities aggregator (Qwoted+HARO+Connectively) showed one PERFECT live query — Sopriza (2d left) "which is doing more damage to family finances: higher mortgage/loan payments or elevated living costs?" — agent wrote a strong answer, but it EXPIRED before submit (Qwoted role wasn't fixed in time). SourceBottle callouts checked = no genuine consumer-finance fit today (mostly travel/tech/marketing, plus a Canadian-mortgage-broker one that needs a licensed broker = skip, YMYL honesty).

### NEXT SESSION to-do
1. WEDNESDAY: after balloon article auto-publishes, post the Quora balloon answer (already drafted, with /news/balloon-payment-car-loan link) + GSC Request Indexing the balloon URL.
2. Fix Qwoted account role (Journalist→Expert), then answer fresh finance journalist requests (editorial links = best authority lever).
3. Watch email for Wealth of Geeks reply → agent writes full guest article w/ 1 dofollow link.
4. "credit score range" candidate article: get SEMrush data (Vol+KD+Intent+SERP) → verify winnability → write (GSC shows 27 impressions, no dedicated article yet).
5. Recheck GSC: did the 13 redirect pages clear (validation), is anything reaching page 2-3 yet (positions 11-30) to refresh-and-push.
6. Keep backlink drip: 1-2 genuine Quora/day, genuine guest blogs only when a real free+dofollow page exists, promote Home Affordability Index asset.

### 23b. Directory/platform backlink blitz (21 Sep 2026 eve) — 8 total actions today
Owner wanted "aise aise backlinks" (high-DR submit-a-product/profile platforms). Ran a verified,
zero-spam batch. NEW platforms done this session (do NOT repeat):
- **Product Hunt — Home Affordability Index:** NEW separate launch created & SCHEDULED for next day
  (Sep 22). Note: "Coinscribed" (calculators) was already Live on PH since Sep 15. The investor
  "Connect with Investors" step is optional — skipped. When it launches: post first comment
  (maker intro drafted), gather genuine upvotes via LinkedIn/network, reply to comments.
- **SaaSHub:** submitted (Free plan, NOT Priority+ paid). Name Coinscribed, tagline "Free financial
  calculators & the Home Affordability Index", categories Finance/Fintech/Personal Finance/Calculators,
  competitors listed (NerdWallet, Bankrate, SmartAsset, Calculator.net — required or queue slows),
  LinkedIn URL added. Pending approval (up to ~32 days on free).
- **AlternativeTo:** submitted for review. App "Coinscribed", website coinscribed.com, Online platform,
  Proprietary, Free, tags finance/calculator/personal-finance/mortgage. IMPORTANT lesson: AlternativeTo
  apps are near-invisible without alternatives, so added alternatives (NerdWallet, Bankrate, SmartAsset).
- **Substack:** publication "Coinscribed" created; first post PUBLISHED — republished the live APR vs APY
  article ("APR vs APY: What's the Difference (and Why It Matters)?") with a link back to the original
  https://www.coinscribed.com/news/apr-vs-apy at the end (avoids duplicate-content). Tags: Personal
  Finance, Money, Banking, Saving, Financial Literacy. TODO: confirm publication About/Settings has
  website URL https://www.coinscribed.com (permanent backlink). Reuse for future article republishes.
- **Trustpilot:** business profile CLAIMED & LIVE (Financial Planner category, "Money & Insurance >
  Investments & Wealth > Financial Planner"). "Visit website" → coinscribed.com backlink live; company
  description + contact (website + email varun@coinscribed.com + Houston, US) set. Skipped the paid
  "Discovery bar" (Plus plan). Free profile is enough. Can request genuine reviews later for trust.
- Plus earlier today: Reddit (value-only), Wealth of Geeks guest pitch, 2 Quora answers (see §23).

VPN NOT needed — these platforms are global, sign-up/submit works fine from India; content/audience
being US doesn't require a US IP or US phone. India +91 phone was fine for Trustpilot.

FRESH platforms still to try (drip, next sessions): BetaList (was down/not loading today — retry),
Vocal Media (finance article republish + dofollow bio), Launching Next, SaaSworthy, Startup Stash,
Gravatar; chase Crunchbase approval. AVOID: random "500 free directory" lists, paid "guaranteed DR90"
services, Fiverr backlink gigs (link-farm = YMYL penalty risk). About.me needs Google/FB login (skipped).

RUNNING TALLY of backlink channels now live/submitted: Crunchbase(pending), LinkedIn Company Page,
F6S, Owler, Startup Ranking, Product Hunt (Coinscribed live + Home Affordability Index scheduled),
issuu (Home Affordability Index PDF), Medium (Rule of 72 + Home Affordability Index, canonical),
SaaSHub(pending), AlternativeTo(pending), Substack(live), Trustpilot(live). Quora 5 answers, Reddit warm-up.

---

## 24. Content-republish + profile backlink drive (22 Sep 2026)

Owner wanted 10 high-quality backlinks in a day. `remote_web_search` tool was DOWN (24h+, provider-side)
but page-fetch worked, so verified platforms via fetch + owner screenshots. Did NOT force spam to hit 10 —
quality only. IMPORTANT RULE reaffirmed: only ever link to LIVE articles (dead/scheduled links are useless).

### CONFIRMED LIVE articles (only build backlinks to these — verified in sitemap §9):
what-is-apr, what-is-apy, apr-vs-apy, what-is-a-good-credit-score, simple-vs-compound-interest,
rule-of-72, debt-snowball-vs-avalanche, how-to-pay-off-credit-card-debt, how-to-pay-off-a-loan-faster,
best-high-yield-savings-account, how-to-build-an-emergency-fund, 401k-vs-roth-ira,
how-much-to-contribute-to-401k, 401k-employer-match-explained, how-to-find-routing-number-on-check,
monthly-payment-300k-400k-500k-mortgage. Also LIVE: /home-affordability-index (static asset).
NOTE: negative-equity-car-loan was NOT live yet when we tried it (Tue schedule slipped) — do NOT link
it until confirmed live. balloon-payment-car-loan scheduled Wed 23 Sep.

### Backlinks DONE this session (do NOT repeat):
1. **Gravatar** — profile LIVE (gravatar.com, Automattic/WordPress high-trust). Varun Attri, Founder at
   Coinscribed, Texas, bio, Links section → Coinscribed.com (with preview). Backlink live.
2. **Dev.to** — post published: "How We Built a Home Affordability Index for 30 US Cities" with body link
   to /home-affordability-index (attempted canonical via front matter). LESSON: Dev.to uses Markdown —
   `##` headings need a BLANK LINE above and below to render; front-matter `---` block can break the body
   if malformed; hit an "Invalid authenticity token" error once (fix = refresh/re-login). Reuse Dev.to for
   canonical republishes (DR ~90).
3. **LinkedIn Article** (owner's profile) — published "How to Build an Emergency Fund (Even When Money
   Feels Tight)" with link to /news/how-to-build-an-emergency-fund.
4. **Medium** — 2nd republish "Simple vs Compound Interest" with canonical to
   /news/simple-vs-compound-interest (use Medium "Import a story" for auto-canonical; handle @varunattri3245).
5. **Substack** — 2nd post "Debt Snowball vs Debt Avalanche" with link to /news/debt-snowball-vs-avalanche
   (publication "Coinscribed" already set up; reuse for future republishes).

### VERIFIED SKIP this session (do NOT retry):
- **Vocal Media** — NOT available in India (geo-blocked); needs VPN, skip.
- **SaaSworthy** — SaaS-products-ONLY (disclaimer says so) + "Talk to Us"/funding sales form; Coinscribed
  is a free calculator/content site, not SaaS → poor fit, likely reject. Skip.
- **LaunchingNext** — behind a captcha/verification wall on fetch; retry manually if wanted.
- **About.me** — Google/FB login only (from prior session).

### Platform-type lesson (which backlink types actually fit Coinscribed):
BEST FIT = (a) content republish w/ canonical/link (Dev.to, Medium, Substack, LinkedIn Articles, Hashnode)
and (b) genuine profile/brand citations (Gravatar, Trustpilot, Crunchbase, LinkedIn, F6S, Owler). SaaS/tool
directories (SaaSHub, AlternativeTo) work but call it a "tool", and pure-SaaS ones (SaaSworthy) reject
non-SaaS. Journalist platforms (Qwoted/Featured/SourceBottle) = strongest for YMYL but need the Qwoted
role fix (Journalist→Expert) still pending. Product Hunt: Coinscribed live since Sep 15; Home Affordability
Index launch was scheduled for Sep 22 — CHECK if it went live and gather upvotes/first-comment/replies.

### FRESH platforms still to try next (drip, India-friendly, content-fit):
Hashnode (canonical republish, DR high), Crunchbase (chase approval — already submitted), BetaList (retry),
Reddit (value-first answers), more Medium/Substack/Dev.to republishes of the LIVE articles above, Gravatar
done. AVOID: link-farm "500 directory" lists, paid "guaranteed DRxx" services, Fiverr gigs (YMYL penalty risk).

### RUNNING backlink tally (live or submitted):
Gravatar(live), Dev.to(live), LinkedIn Article(live), Medium(Rule of 72 + Home Affordability Index +
Simple-vs-Compound, canonical), Substack(APR-vs-APY + Debt Snowball, live), Trustpilot(live claimed profile),
SaaSHub(pending review), AlternativeTo(pending review), issuu(Home Affordability Index PDF), LinkedIn Company
Page, F6S, Owler, Startup Ranking, Product Hunt (Coinscribed live + Home Affordability Index launch),
Crunchbase(pending approval). Quora = 5 genuine answers. Reddit = warm-up value answers.

### CONTEXT NOTE — long session caused UI churn
This session got very long; owner found the repeated auto-updates annoying and is starting a FRESH session.
Everything above (steering §23, §23b, §24 + PRs #92/#93/#94 + this save) is the full A-to-Z record so a new
session resumes with zero loss. Reminder: sandbox `remote_web_search` was DOWN 24h+ (provider-side) but
page-fetch, git, PR, code all worked fine — search being down does NOT block the work.

### NEXT SESSION to-do (priority)
1. Product Hunt: confirm Home Affordability Index launched (Sep 22); post drafted maker first-comment,
   gather genuine upvotes (LinkedIn/network), reply to comments.
2. Wed 23 Sep: balloon-payment-car-loan auto-publishes → then post the drafted Quora balloon answer (with
   link) + GSC Request Indexing the balloon URL. Also confirm negative-equity-car-loan is finally live.
3. Fix Qwoted account role (Journalist→Expert) → answer finance journalist requests (best YMYL links).
4. Watch varun@coinscribed.com for Wealth of Geeks reply → agent writes full guest article w/ 1 dofollow link.
5. "credit score range" candidate article (GSC 27 impressions, no dedicated article) — get SEMrush data
   (Vol+KD+Intent+SERP) → verify winnability → write.
6. Recheck GSC: 13 redirect pages cleared? anything reaching page 2-3 (pos 11-30) to refresh-and-push?
7. Continue backlink drip (Hashnode, Crunchbase approval, more republishes; 1-2 Quora/day value-first).
