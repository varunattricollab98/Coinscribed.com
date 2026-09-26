# Coinscribed.com — Single Project Memory

> **This is the ONE memory file for Coinscribed.** Read it at the start of every
> session so you (the agent) resume with full context and the owner never has to
> re-explain. Do NOT create other memory/notes files — everything lives here.
>
> **How to keep it:** Keep the top sections (1–10) as the always-current snapshot —
> edit them in place when facts change (metrics, inventory, tally, status). Append
> dated one-liners to the **Session Log (§11)** for history. Save ONLY when the owner
> says "save". Keep it tight — trim stale detail rather than letting it grow forever.

---

## 1. What this is

**Coinscribed.com** — a live US personal-finance content website. Solo-owned.
**Goal:** millions of organic US visitors + high domain authority + AdSense approval →
real income within ~6 months. Content is AI-assisted but must read 100% human and be
genuinely valuable so real US readers come, stay, and trust it.

- **Stack:** Next.js (App Router) + Sanity CMS, deployed on **Vercel**.
- **Repo:** `varunattricollab98/Coinscribed.com` (GitHub).
- **Live:** https://www.coinscribed.com (apex `coinscribed.com` 308-redirects to `www`).
- **Owner:** Varun Attri · email **varun@coinscribed.com** (Hostinger mailbox, on phone Gmail).

## 2. Roles & working style

- **Agent = SEO Head / strategist / CEO of growth.** Agent decides everything: topics,
  keywords, technical fixes, backlink strategy, priorities, and writes all content.
  **Owner = executor** — pastes into Sanity, clicks GSC/Bing indexing, sends pitches,
  creates accounts. "Tu boss hai."
- Agent's sole job: get the site to rank #1, bring organic US traffic, get AdSense
  approved. Expert in SEO + AEO + GEO (content that AI search engines pick up too).
- **Reply language: Hinglish** (Hindi + English, casual, "bhai" tone). Keep replies
  SHORT/crisp — owner dislikes long status recaps.
- **Agent has NO Sanity/CMS access.** Deliver articles **paste-ready in ONE chat block**
  (Sanity fields + body). Owner pastes via `/admin` "Import from HTML".
- Owner shares **SEMrush data as TEXT** only (XLSX uploads arrive garbled). Always ask for text.
- **Data-first rule:** never write an article without SEMrush Volume/KD/Intent/SERP first.

## 3. Content standard (mandatory)

- **100% human-feel, AI-detection-proof:** real personal-story intro, contractions,
  burstiness, conversational asides, opinion. **NO AI clichés** (delve, furthermore,
  seamless, unlock, "in today's world"). Detectors may still flag republishes — that's
  fine for small republishes; keep the MAIN articles genuinely human + helpful.
- **Web-verified live numbers** (IRS/Fed/FDIC/Freddie Mac). Round volatile figures /
  use ranges + "as of <year>" so the piece stays evergreen (YMYL-safe).
- **GEO/AEO:** match Google AI-Overview structure — a Quick/Short Answer box near the
  top, clean extractable definitions, exact-match H2/H3 for green-KD queries, 6–8 FAQs
  from PAA, comparison tables. Speakable schema already emitted sitewide.
- **YEAR-IN-TITLE rule:** evergreen topics (salary/affordability, definitions, how-to,
  comparisons) → **NO year** in Title/SEO Title. Only put a year on genuinely
  year-changing topics (IRS limits, tax brackets, annual rate roundups) + add a
  "re-verify yearly" note.
- **Internal links:** every article links a relevant calculator + a related article
  (pillar+cluster, same-tab). All link targets must be LIVE before linking.
- **Do NOT add a manual disclaimer** — `ArticleView.tsx` auto-renders an "Editorial
  Notice" at the end of every article.
- **Key Takeaways:** 3–5 crisp GEO bullets per article (Sanity field after Excerpt;
  rendered under the hero). Editable in `/studio` and `/admin`.
- Article drafts are backed up in `.agents/drafts/`.

### Paste-ready delivery format
- **Fields:** Title, Slug (≤96), Excerpt (≤300), SEO Title (≤70), SEO Description (≤160),
  Author, Category, schedule. **Field limits are intentional — do NOT raise them.**
- **Body markers:** `[H2] [H3] [H4] [Bullet] [Table] [Normal]`, bold `**..**`,
  links `[text -> /path]`. Body is Sanity **Portable Text** end-to-end (no HTML string,
  no markdown, no dangerouslySetInnerHTML). `/admin` Import-from-HTML converts pasted
  HTML → Portable Text at input time.
- **Authors:** Ethan Caldwell (Banking), Marcus Bennett (Economy/mortgage/loans),
  Rachel Morgan (retirement/economy), Coinscribed Team.
- **Categories:** Banking, Economy, Markets, Crypto.
- **Cadence:** ~1–2 winnable articles/week (was 5/wk; slowed — content base is enough).
  Publish Tue–Fri 8:00 AM ET (≈5:30 PM IST). Weekends off.

## 4. SEO keyword-picking logic (how the agent chooses topics)

- **Reject high-KD head terms** (SERP owned by Tier-1: Bankrate/NerdWallet/Investopedia/
  banks/.gov with hundreds of ref domains). Target **green-KD (<~35) winnable long-tails**.
- **Find the SERP gap:** if Reddit / 0-ref-domain / thin pages sit in the top 10, it's
  beatable. Weave the green-KD cluster as exact-match H2/H3 + FAQ sections.
- **No cannibalization:** check the inventory (§7) before writing; if an existing article
  already owns the cluster, OPTIMIZE it instead of writing a duplicate.
- Prefer topics that feed the site's strongest GSC clusters (currently AUTO/CAR LOAN).

### Keyword Research Playbook (run this 6-step process for EVERY article — like a pro analyst)

**Mindset:** we are a 0-authority, ~2-month-old site. Don't chase volume — chase
**WINNABILITY**. A 590-vol / KD-32 keyword we can win beats a 50K-vol / KD-80 keyword we'd
sit at page 9 for. High CPC is a bonus (AdSense value) but never overrides winnability.

1. **Seed & Intent.** Decide intent first. INFORMATIONAL ("what is / how to / how does")
   = our target (blogs rank here). COMMERCIAL ("best / vs / review") = Tier-1 product pages
   own it, avoid. TOOL ("calculator") = our calculators handle it, don't fight it with an
   article. If the SERP is full of product/bank pages, pivot to the informational angle.
2. **SEMrush Overview** (owner sends as TEXT): Volume (US), KD %, Intent, CPC. KD rule:
   **0–29 green = TARGET · 30–39 possible = TARGET · 40–49 yellow = weave into a section/FAQ
   only · 50+ hard = REJECT as primary.**
3. **SERP analysis (the real skill).** Look at the top 10, not just KD. Count how many are
   Reddit / Quora / 0-ref-domain / thin pages → that's a **SERP GAP = winnable**. If it's
   all Tier-1 (AS 70+, 100+ ref domains), reject. Golden signal: weak pages ranking = Google
   has no good content = we can get in.
4. **Magic Tool / cluster.** Expand the seed into questions + variations. Pick 1 primary
   green-KD keyword (Title/H1) + 5–10 green-KD long-tails as exact-match H2/H3 + FAQ, and
   weave higher-vol yellow terms into body sections. One article captures the whole cluster.
5. **Cannibalization check** against inventory (§7). If an existing article owns the
   cluster, OPTIMIZE that one (new FAQs/sections/SEO fields) instead of writing a duplicate.
6. **Strategic fit.** Does it feed a strong GSC cluster (§5)? Is a live calculator +
   related article available to internal-link? Is it evergreen (year-in-title rule)?

**Verdict output:** for each topic the agent returns GO / REJECT / OPTIMIZE-EXISTING, the
primary keyword, the green-KD cluster to target, and the internal links — then writes the
paste-ready article only on GO. (Reference example: negative-equity-car-loan — rejected
"auto loan calculator" KD 85 & "auto refinance" KD 55, chose "negative equity car loan
calculator" 590/KD 32 because positions 6–9 were Reddit/0-ref pages = SERP gap.)

## 5. Current state — the honest diagnosis (UPDATE THIS)

**Phase: AUTHORITY building.** Content ✅ and technical/on-page SEO ✅ are DONE and
pro-level — do NOT keep "fixing" on-page; it's marginal. The ONLY lever left for traffic
is **editorial (dofollow) backlinks + time** (new-site sandbox typically 3–6 months).

**Metrics baseline (track vs this each session):**
- **SEMrush (Sep 25 2026):** Backlinks **65** · Ref Domains **54** · **Authority Score 0** ·
  Organic Traffic 0 · Organic Keywords **363** · AI Visibility 0. (Up from 47/37/306 on Sep 21 —
  ref domains + keywords rising, but Authority still 0 = editorial dofollow is the unmoved lever.)
- **GSC (3-month, ~25 Sep 2026):** Impressions **6.25k** (rising) · Clicks **3** ·
  CTR 0% · **Avg position 55.1** (page 5–6, steadily improving: 63.5→58.8→57.1→55.1).
  Top queries confirm the AUTO/CAR cluster is #1 (loan calculator auto 46, negative equity
  car loan calculator 32, car balloon payment calculator 32, negative equity calculator 30),
  plus CREDIT SCORE ("credit score range" 39 + "what is the credit score range" 32) and
  APR ("what is apr" 44). Clicks are ~0 purely BECAUSE position is page 5–6 — expected.
- **Diagnosis:** 306 keywords rank but all page 4+, so traffic ≈ 0. CTR is low BECAUSE
  position is page 6 (not a title/meta problem — a POSITION problem). Position only
  moves with authority + time. AI Visibility 0 = open GEO opportunity.

**Strongest GSC clusters (where to focus internal-link equity + new articles):**
1. **AUTO / CAR LOAN** (#1) — auto-loan-calculator ~1,474 impressions; many neg-equity /
   balloon / "credit score for car" / "how does a car loan work" queries.
2. **SAVINGS** — savings-calculator ~1,338 impressions.
3. **CREDIT SCORE** — good-credit-score ~663 impressions.
4. **APR / APY / INTEREST** — "what is apr" is the single highest query.

## 6. What NOT to do (traffic/YMYL guardrails)

- Do NOT buy links, use PBNs, link farms, bulk "500-directory"/"guaranteed DR90" services,
  or Fiverr backlink gigs — YMYL penalty risk. Cold-email link offers = default skeptical;
  paid-dofollow / bulk-directory = auto-reject.
- Do NOT pump 5 articles/day, keyword-stuff, or promise "instant traffic."
- Do NOT link to pages that aren't live yet (scheduled/404). "Jo live nahi hai wo panga mat lo."
- Do NOT over-optimize anchors — mostly branded + natural anchors.
- Do NOT re-flag already-solid on-page items as broken (see §8). On-page is MAXED.
- **DELIBERATELY EXCLUDED calculators** (YMYL risk): income tax, paycheck, capital gains,
  Social Security. Per-state bank-routing pages are deprioritized (low volume, YMYL risk).

## 7. Article inventory (source of truth for slugs — avoid duplicates)

URLs: `https://www.coinscribed.com/news/<slug>`.

**LIVE:** 401k-employer-match-explained · 401k-vs-roth-ira · apr-vs-apy ·
best-high-yield-savings-account · debt-snowball-vs-avalanche · how-much-to-contribute-to-401k ·
how-to-build-an-emergency-fund · how-to-find-routing-number-on-check · how-to-pay-off-a-loan-faster ·
how-to-pay-off-credit-card-debt · monthly-payment-300k-400k-500k-mortgage · rule-of-72 ·
simple-vs-compound-interest · what-is-a-good-credit-score · what-is-apr · what-is-apy ·
what-is-a-roth-ira · how-much-house-can-i-afford · how-to-save-for-a-down-payment ·
how-to-get-rid-of-pmi · cd-vs-high-yield-savings-vs-money-market ·
difference-between-checking-and-savings-accounts · negative-equity-car-loan ·
balloon-payment-car-loan · credit-score-to-buy-a-car.
**Static asset:** /home-affordability-index (50-metro data study — the linkable asset; expanded
from 30 on 25 Sep, PR #110/#111; now has a price-to-income column + rate-sensitivity insight).

**SCHEDULED / not yet live:** how-does-a-car-loan-work (Fri 25 Sep, draft #26).

**Clusters:** Auto/Car (negative-equity, balloon, credit-score-to-buy-a-car,
how-does-a-car-loan-work + auto-loan calc) · Retirement (401k-match, how-much-401k,
401k-vs-roth, roth-ira) · Debt (snowball, loan-payoff-faster, credit-card-debt) ·
Banking (apr, apy, apr-vs-apy, credit-score, hysa, routing, cd-vs-hysa, checking-vs-savings,
write-a-check) · Interest (simple-vs-compound, rule-of-72) · Mortgage (monthly-payment,
how-much-house, down-payment, pmi).

**Calculators (14):** mortgage, 401k, emi, sip, loan-payoff, compound-interest, retirement,
auto-loan, credit-card-payoff, savings, emergency-fund, roth-ira, apy. (Each has correct
layout metadata + canonical + JSON-LD — confirmed good, don't re-flag.)

### Competitor landscape (50, tiered — Sep 2026; full list in Google Sheet)
- **Tier 1 — Giants (avoid head-to-head, learn from, steal long-tails):** NerdWallet,
  Bankrate, Investopedia, SmartAsset, Forbes Advisor, The Balance, Kiplinger, Experian,
  Calculator.net, GoBankingRates, Fidelity, CNBC Select.
- **Tier 2 — Mid (real competitors, sometimes backlink targets):** MagnifyMoney, The College
  Investor, Money Crashers, The Penny Hoarder, DollarSprout, Money Under 30, LendEDU,
  Crediful, Doctor of Credit, Clark.com, Get Rich Slowly, Clever Girl Finance, Motley Fool
  Ascent, WalletHub, MyBankTracker, CreditCards.com, Quicken Simplifi, Empower.
- **Tier 3 — Small/beatable (OUR weight class = real competitors + BEST guest/backlink
  targets):** Wealthy Nickel, Wealth of Geeks, FinanceBuzz, Frugal Rules, Well Kept Wallet,
  Financial Pilgrimage, Budgets Are Sexy, The Ways to Wealth, Lazy Man and Money, Man vs
  Debt, Making Sense of Cents, Money Done Right, Savings Grove, Jason Fin Tips, FinancialAha,
  Gerald, Best Money, ExpertBeacon, FangWallet, Guide to Money.
- **Use:** Tier 3 is where we can realistically outrank + earn links; always live-verify a
  Tier-2/3 site (genuine free + dofollow + US finance + not spam) before pitching (§9 skip-list).

## 8. Technical / dev facts (already solid — reference only)

- **On-page SEO is maxed** (verified pro-level; STOP re-fixing): per-page titles/canonicals/
  metadataBase, dynamic article metadata (OG w/ modifiedTime + image fallback to
  siteConfig.ogImage), full JSON-LD (Article+Speakable, conditional FAQPage, HowTo,
  Breadcrumb, Organization w/ confirmed-only sameAs, WebSite, CollectionPage/ItemList on
  category+news+calculators+bank index), sitemap.ts + robots.ts (+ AI-crawler allow),
  /llms.txt, topical internal linking (lib/related-articles.ts scoring +
  bidirectional article↔calculator via relatedCalculatorForArticle).
- **Canonical host = www** (config/site.ts `url`/`ogImage` = https://www.coinscribed.com).
  All URLs derive from siteConfig — never hardcode the apex.
- Do NOT add WebSite SearchAction schema — site has no `?q=` search (false signal, YMYL).
- **Admin:** `/admin` (custom editor — status filters, search, Preview, Import-from-HTML,
  Key Takeaways) and `/studio` (Sanity Studio). Sanity project **h0xv92n1**, dataset
  `production`. Admin auth = Sanity's own login (withCredentials cookie). If login breaks:
  (1) CORS in manage.sanity.io must include both www + apex with "Allow credentials"; (2)
  `getLoginUrl` points at `https://www.sanity.io/login?...`; (3) fallback = `/studio`.
- **Contact + Newsletter:** `/api/contact` + `/api/newsletter` store to Sanity via a
  server-only **`SANITY_WRITE_TOKEN`**. **PENDING owner:** set `SANITY_WRITE_TOKEN` in
  Vercel (Production+Preview) or both forms return 503. **Deferred:** add Resend so
  submissions also email varun@coinscribed.com (owner: create Resend acct + verify domain
  DNS + add RESEND_API_KEY; agent: `bun add resend` + non-blocking send after Sanity write).
- **Content lives in Sanity, NOT the repo** — article title/body/FAQ edits are owner-done
  in `/admin` from the paste-ready text the agent provides.

### Build / PR workflow (every time)
1. `bunx tsc --noEmit` + `bunx next lint` + `bunx next build` — all clean. (In sandboxes
   with no npm access this fails for environmental reasons; then rely on GitHub Actions CI.)
2. **Always revert bun.lock** (`git checkout bun.lock`) — never commit it.
3. Never commit code to `main`. Feature branch → push → PR via
   `gh api repos/varunattricollab98/Coinscribed.com/pulls -f title=... -f body=... -f head=... -f base="main"`
   (NOT `gh pr create`). Wait for CI build → squash-merge
   (`gh api -X PUT repos/.../pulls/{n}/merge -f merge_method="squash"`). Agent may merge its own PRs.
   (Steering/memory doc commits directly to main are fine.)

## 9. Backlink strategy & tally

**#1 lever = EDITORIAL / journalist DOFOLLOW links** (these move Authority Score; we have
almost none). Priority order:
1. **Journalist platforms** — SourceBottle (profile LIVE, watch "Drink Up!" alerts),
   Featured/HARO successors. **Qwoted = passive** (free source account doesn't expose
   journalist requests; a new "Expert/Source" role fix was attempted; leave it — journalists
   can still find the directory profile). Answer only genuine US consumer-finance queries.
2. **Home Affordability Index outreach** — the star linkable asset; kit at
   `.agents/drafts/home-affordability-index-OUTREACH-KIT.md`. Best angle = LOCAL-MEDIA
   city pitches (per-city income figures in the kit). Owner finds prospects (Google
   operators in kit) → agent verifies each live + personalizes → owner sends from
   varun@coinscribed.com. When a genuine free guest blog says yes, AGENT writes the full
   original article with exactly ONE natural contextual link.
3. **Content republishes** (brand/referral/GEO value): Medium (@varunattri3245, "Import a
   story" = auto-canonical), Substack ("Coinscribed" pub, link-back at end, no canonical
   field), Dev.to (canonical URL field), LinkedIn Articles. Humanise to reduce detector
   flags. Never duplicate the same article on the same platform.
4. **Quora** — 1–2 value-first answers/day, consumer-finance Qs only, nofollow (brand/GEO).
   Check if the exact question already has your answer before posting (pick a sibling Q).
   **Reddit** — value-only, warm-up (owner's personal account); links only later, sparingly.

**Verified SKIP list (do NOT retry):** ElitePersonalFinance (pays, forbids links),
FangWallet/CashLady/DebtHelper (paid placements), Due.com/MoneyGeek/CuraDebt (credential-gated),
Credit Suite/Think Save Retire (nofollow/B2B), RealEstateAgent.com (reciprocal), Resourceful
Finance Pro (wrong audience), Vocal Media (India geo-blocked), SaaSworthy (SaaS-only),
DollarSprout/Well Kept Wallet/Good Financial Cents/DoughRoller/Money Crashers/Penny Hoarder/
SavingAdvice (dead/404/paid write-for-us pages), Hashnode (auto-mod removed republishes;
OFF rotation), fosburit/ordnur/laptopspapa/fincover/prposting/jootoor/LaunchBuff/Launchstag/
LaunchIgniter (link-farm/paid spam). **Lesson:** genuine free+dofollow+YMYL-safe+relevant
finance guest blogs are <~15% of "write for us" pages — quality drip beats volume.

**Live/submitted tally:** Gravatar · Dev.to (Home Affordability, APR-vs-APY, Negative-Equity) ·
LinkedIn Article ×4 (Emergency Fund, Credit-score-to-buy-a-car, Good Credit Score, Home
Affordability) · LinkedIn Company Page · Medium ×6 (Rule of 72, Home Affordability,
Simple-vs-Compound, 401k-vs-Roth, Credit-Card-Debt, Credit-Score-to-Buy-a-Car) · Substack ×5 (APR-vs-APY, Debt Snowball,
HYSA, Rule of 72, How-Does-a-Car-Loan-Work) · Trustpilot · issuu (Home Affordability PDF) · F6S · Owler · Startup Ranking ·
Product Hunt ×2 (Coinscribed + Home Affordability) · SaaSHub (LIVE, approved 25 Sep) · AlternativeTo (pending) ·
Crunchbase (pending) · PeerPush (queue ~Nov, AI-discovery/GEO play). Quora ~9 answers. Reddit warm-up.

## 10. Open items / next actions

- **Owner asked for a list of ~50 competitors** (tiered: Tier-1 giants to avoid, Tier-2 mid,
  Tier-3 small/beatable = real competitors + backlink targets). Do with web + SEMrush.
- **how-does-a-car-loan-work** (#26) publishes Fri 25 Sep → GSC Request Index → add to
  auto-loan-calculator relatedReading + a republish.
- **Home Affordability Index outreach** = the real editorial-dofollow lever — execute the kit.
- **Owner action pending:** set `SANITY_WRITE_TOKEN` in Vercel (forms); later Resend.
- **NAME CONSISTENCY (confirm with owner):** all backlinks/pitches use "Varun Attri, Founder,
  Coinscribed." Owner once asked for a LinkedIn summary as "Navdeep Singh, Writer at
  Coinscribed" — unresolved whether that's a new author persona or the same person. Don't
  use two names until clarified (E-E-A-T consistency).
- **E-E-A-T:** once real brand social accounts exist, set them `confirmed:true` in
  `config/site.ts` `social` so Organization schema emits `sameAs` (LinkedIn already confirmed;
  Twitter/Facebook still `confirmed:false` — no accounts yet).

---

## 11. Session Log (append dated one-liners; newest at bottom)

- **≤24 Sep 2026 (consolidated):** Site built + redesigned (Ink&Oxblood → modern fintech),
  custom /admin editor w/ Import-from-HTML shipped, 25 articles + 14 calculators +
  Home Affordability Index asset live, GA4 internal-traffic exclusion, contact form +
  newsletter (Sanity-stored), www-canonical fix (PR #90), on-page SEO maxed (PRs through
  #109), llms.txt + AI-crawler allow (PR #104). Auto/car-loan cluster built + interlinked.
  Backlink foundation laid across the channels in §9. Diagnosis settled: AUTHORITY phase —
  content+technical done, only editorial backlinks + time remain. (Full historical detail
  was trimmed into the snapshot above; this file replaced the old 1500-line multi-log version.)
- **24 Sep 2026:** apr-vs-apy SEO restored (accidental swap fixed); what-is-apy optimized for
  "apy meaning" (27.1K/KD33) + 3 FAQs; credit-score-to-buy-a-car published + indexed;
  PRs #108 (OG image fallback, /news schema, sitemap noindex fix) + #109 (credit-score →
  auto-loan calc link) merged; backlinks: LinkedIn Article (Affordability Index) + 2 Quora +
  Dev.to (Negative Equity). Consolidated all memory into this single file.
- **25 Sep 2026:** Built the tiered 50-competitor list (added to §7) and formalized the
  6-step Keyword Research Playbook (§4b). No code changes — strategy/memory only.
- **25 Sep 2026 (GSC check):** 3-month GSC = 6.25k impressions (up from 5.37k) / 3 clicks /
  pos 55.1 (up from 57.1) — trend positive, still page 5–6 = authority phase confirmed.
  Updated §5 baseline. Queries confirm AUTO/CAR #1 + CREDIT SCORE ("credit score range") demand.
- **25 Sep 2026:** PMI article GSC "Duplicate without user-selected canonical" report was STALE —
  URL Inspection showed "Page is indexed" + self-canonical correct; resolution = click Validate Fix,
  no code change (lesson reaffirmed: trust URL Inspection over the report). how-does-a-car-loan-work
  (#26) now LIVE. Backlink drip: Medium republish of credit-score-to-buy-a-car (Import-a-story =
  auto-canonical, humanised intro) — feeds the #1 AUTO/CAR cluster. Also reaffirmed to owner: no-clicks
  is a POSITION problem (page 5–6 → ~0% CTR), NOT an "AI content" problem (Google ranks on quality,
  not authorship; impressions rising = content is acceptable). Lever stays authority + time.
  Plus 2 Quora answers (value-first, sibling Qs): "right down payment for a car" → negative-equity-car-loan,
  and "what a low credit score means for future loans" (was a no-answer-yet Q = only answer) →
  what-is-a-good-credit-score. Quora tally ~7→~9. Plus Substack republish of how-does-a-car-loan-work
  (humanised, link-back at end; Substack ×4→×5) — 4 distinct channels today (Medium/Quora×2/Substack),
  all feeding the #1 AUTO/CAR + CREDIT clusters, spam-safe footprint.

- **25 Sep 2026 (asset expansion):** Expanded the Home Affordability Index (our #1 editorial-backlink
  asset) — PR #110 grew it 30→50 metros (web-verified Zillow city benchmarks, rounded/YMYL-safe: added
  Riverside, Salt Lake City, Providence, Raleigh, Orlando, Richmond, Tucson, Hartford, Jacksonville,
  Cincinnati, Louisville, St. Louis, Buffalo, New Orleans, Birmingham, Milwaukee, Philadelphia, Oklahoma
  City, Baltimore, Memphis). PR #111 added a computed price-to-income column + a rate-sensitivity callout
  (avg income drop if the 30-yr rate fell 6.5%→5.5%) + updated copy/metadata/JSON-LD "30→50 cities".
  Both additive/computed (nothing fabricated), CI-green, squash-merged. Result: 50 city-angle local-media
  pitch targets + a more citeable study.
- **25 Sep 2026 (SEMrush):** New baseline (Sep 25) = Backlinks 65 · Ref Domains 54 · Authority Score 0 ·
  Organic Keywords 363 (up from 47/37/306). Ref domains + keywords rising (backlink drip + directories
  working), but Authority Score still 0 → editorial DOFOLLOW remains the unmoved lever.
- **25 Sep 2026 (guest-blog research):** Verified List with Clever (listwithclever.com/write-for-real-estate-blog)
  = genuine FREE, up to 3 relevant backlinks, explicitly WANTS stat citations linked to a source (perfect for
  the Home Affordability Index) — BUT pitch form requires 3 prior guest-writing samples on other sites → HOLD
  until we have samples. Get Finance Post = free but B2B/lower-authority = backup only. AI-suggested targets
  Wise Bread / Modest Money / The Financial Diet / Money Under 30 were dead/blocked (verify-before-trust holds).

- **25 Sep 2026 (owner directive — FOCUS):** Owner wants a long, full-throttle backlink session ("aaj to
  start hua hai", don't suggest stopping before ~4 hrs in). GAME IS NOW BACKLINKS — impressions are already
  rising (6.25k, pos 55), so the ONLY lever left is high-quality EDITORIAL/DOFOLLOW backlinks (authority),
  not more on-page or more impressions. Drive quality backlinks relentlessly this session. Keep it YMYL-safe
  (no spam/paid/link-farm) but keep momentum high — don't call it a day early.

- **25 Sep 2026 (guest post SENT):** Propaura (propaura.com/write-for-us, info@propaura.com) — verified
  GENUINE free guest blog, niche = Real Estate + Finance + Home Improvement, contextual links allowed
  (natural/dofollow), 600+ words, 24-hr approval, content becomes their IP. AGENT wrote a full original
  ~1,300-word article "How Much Do You Really Need to Earn to Buy a Home in America's Biggest Cities?"
  (28% rule, San Jose ~$390k vs Detroit ~$57k, 7×+ gap) with ONE natural contextual link to
  /home-affordability-index + author bio "Varun Attri, Founder, Coinscribed". Sent as .doc + branded
  featured image. Awaiting reply. (First real editorial-dofollow guest pitch of the authority push.)
  Also verified this session: found a maintained "119 verified guest-post blogs" list
  (christopherjanb.com) — Finance/Real-Estate picks: Propaura (used), Money Journey Today (live, next),
  DALTX/SEAINT/Estate Skyline (real-estate, check paths). Skip (paid/known): Elite Personal Finance, FangWallet.
- **25 Sep 2026 (guest post #2 SENT):** Money Journey Today (moneyjourneytoday.com/write-for-us,
  adriana@moneyjourneytoday.com) — verified GENUINE free personal-finance blog, external links to
  "helpful resources (statistics)" allowed, 700-800+ words, unique/exclusive, host handles images.
  AGENT wrote a DIFFERENT ~950-word article (budgeting/personal-journey angle to stay unique vs Propaura):
  "Before You House-Hunt, Know the Income Your City Actually Requires" (28% rule + city income spread) with
  ONE link to /home-affordability-index (framed as a free statistics resource) + bio. Sent as .doc.
  Awaiting reply. Now 2 editorial-dofollow guest pitches out today (Propaura + Money Journey Today).
  RULE reaffirmed: each guest blog needs a UNIQUE article (exclusive) — never reuse the same piece; vary angle.
- **25 Sep 2026 (guest post #3 — Lenders Network BOUNCED → redirected):** The Lenders Network
  (thelendersnetwork.com/contributor, hi@thelendersnetwork.com) verified as a genuine mortgage/homebuyer
  contributor page, so AGENT wrote a 3rd unique article "The Income It Takes to Buy a Home Across America —
  and How Rates Change It" (~1,100 words, mortgage-rate/homebuyer angle, 28% rule + rate-sensitivity) with a
  /home-affordability-index link + bio. BUT the hi@ mailbox BOUNCED (dead contact; contributor page is stale,
  only email listed, no form). LESSON: contributor pages can list dead mailboxes — a bounce means drop that
  target, don't chase. Redirected the SAME article (never published, so no duplicate) to Finance Care Guide
  (financecareguide.com, peter@financecareguide.com — genuine US personal-finance blog, max 3 links) — SENT.
  So today = 3 editorial guest pitches live (Propaura, Money Journey Today, Finance Care Guide); Lenders
  Network dropped (bounce). Get Finance Post = backup (email obfuscated on page, B2B-lean). Purgula
  (purgula.com/write-with-us, form-based, financing/budgeting topic) = untried secondary candidate.
- **25 Sep 2026 (guest pitch #4 — Purgula SENT):** Purgula (purgula.com/write-with-us) — genuine
  homeownership blog, FORM-based intro pitch (no email = no bounce risk), accepts "Financing & Budgeting"
  topic. Submitted intro form (Varun/varun@coinscribed.com/coinscribed.com) proposing article "Financing
  Your First Home: How to Figure Out What You Can Actually Afford" (~950 words, unique 4th angle =
  first-time-buyer financing/budgeting; full draft written & ready to send if they reply). Now 4 editorial
  pitches out today: Propaura, Money Journey Today, Finance Care Guide, Purgula.
  DALTX Real Estate = REJECTED/skip (paid publication fee via PayPal, agencies/resellers welcome = paid
  marketplace, YMYL risk). realtor.com resource hub = GENUINE + high authority (DR~90) but agent/marketing
  audience (not consumer) + "no promotion" → needs an agent-angle article; PARKED as a high-value future try.
  Wealthy Nickel write-for-us page repurposed (no longer takes guest posts). Landlord Tips = genuine but
  landlord/investor angle + obfuscated email.

- **25 Sep 2026 (guest pitch #5 SENT + SaaSHub LIVE):** Get Finance Post
  (getfinancepost.com/write-for-us → editorial@getfinancepost.com, backup Infogetfinancepost@gmail.com) —
  genuine free, "Zero AI policy", 1,000–1,500 words, contextual links on educational anchors only (no
  commercial anchors), and they want 2–3 OUTLINES first (not a full draft), reviewed in 48 hrs. SENT a pitch
  with 3 educational outlines fitting their "Educational personal finance breakdowns" pillar (28% rule /
  amortization mechanics / mortgage rate-sensitivity) + portfolio links (how-much-house-can-i-afford +
  home-affordability-index). If an outline is approved, AGENT writes the full 1,000–1,500-word piece.
  BiggerPockets = PARKED: genuine free + high authority (byline allows 2 links, but self-links banned in
  body) — however /contact returns 403 and owner got "You have been blocked", so no submission route from
  here; an investor-angle article ("What Home Affordability Data Tells Investors About Rental Demand") is
  written and on file if a route opens or for another investing blog.
  **SaaSHub = APPROVED/LIVE** (was pending) — Coinscribed listed under "Recently Verified"; backlink live.
  Their "Premium Listing — 1 month free" upsell and "Experts/vote" prompts = SKIPPED (paid funnel, no extra
  SEO value; free listing already carries the link).