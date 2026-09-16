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
