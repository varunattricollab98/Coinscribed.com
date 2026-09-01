import type {
  Article,
  ArticleCard,
  Author,
  Category,
  PortableTextBlock,
} from '@/lib/sanity-queries'

/**
 * Editorial sample dataset.
 *
 * This module is the fallback newsroom used by `lib/sanity-queries.ts` whenever
 * Sanity has no content. Each story is authored once as an `ArticleSeed`, and
 * the two public shapes the UI consumes — `sampleArticles` (card list) and
 * `sampleFullArticles` (detail pages keyed by slug) — are derived from it. That
 * keeps titles, images, bylines and dates in a single source of truth.
 *
 * Every `imageUrl` and author avatar below points at a verified
 * images.unsplash.com asset (whitelisted in next.config.js).
 */

// ============================================================
// Sample Categories
// ============================================================

export const sampleCategories: Category[] = [
  {
    _id: 'cat-crypto',
    title: 'Crypto',
    slug: { current: 'crypto' },
    description:
      'Latest cryptocurrency news covering Bitcoin, Ethereum, DeFi, NFTs, and blockchain technology.',
  },
  {
    _id: 'cat-economy',
    title: 'Economy',
    slug: { current: 'economy' },
    description:
      'Macroeconomic news including GDP, inflation, employment data, and fiscal policy updates.',
  },
  {
    _id: 'cat-markets',
    title: 'Markets',
    slug: { current: 'markets' },
    description:
      'Stock market, bonds, commodities, forex, and investment analysis.',
  },
  {
    _id: 'cat-banking',
    title: 'Banking',
    slug: { current: 'banking' },
    description:
      'Banking industry news, regulations, fintech innovations, and digital banking updates.',
  },
]

const categoriesBySlug: Record<string, Category> = sampleCategories.reduce(
  (acc, category) => {
    acc[category.slug.current] = category
    return acc
  },
  {} as Record<string, Category>
)

// ============================================================
// Newsroom — author roster
// ============================================================

/** Portrait crop that keeps the subject's face centred inside a circle. */
function avatar(photoId: string): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=facearea&facepad=3&w=160&h=160&q=70`
}

/** Landscape crop sized for 16:9 hero and card thumbnails. */
function cover(photoId: string): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1200&q=70`
}

type AuthorKey =
  | 'michael-torres'
  | 'sarah-chen'
  | 'david-park'
  | 'emily-rodriguez'
  | 'alex-nakamura'
  | 'jennifer-walsh'
  | 'priya-raman'
  | 'robert-feldman'
  | 'danielle-whitfield'
  | 'marcus-ellison'

export const sampleAuthors: Record<AuthorKey, Author> = {
  'michael-torres': {
    _id: 'author-michael-torres',
    name: 'Michael Torres',
    slug: { current: 'michael-torres' },
    bio: 'Michael Torres is a senior cryptocurrency correspondent with more than a decade covering digital assets, exchange infrastructure and the institutional adoption of blockchain markets.',
    imageUrl: avatar('photo-1547425260-76bcadfb4f2c'),
  },
  'sarah-chen': {
    _id: 'author-sarah-chen',
    name: 'Sarah Chen',
    slug: { current: 'sarah-chen' },
    bio: 'Sarah Chen writes about monetary policy and the Federal Reserve. She previously served as a research economist at the Federal Reserve Bank of New York.',
    imageUrl: avatar('photo-1534528741775-53994a69daeb'),
  },
  'david-park': {
    _id: 'author-david-park',
    name: 'David Park',
    slug: { current: 'david-park' },
    bio: 'David Park is a markets reporter covering US equities, fixed income and the flow of institutional capital across asset classes.',
    imageUrl: avatar('photo-1633332755192-727a05c4013d'),
  },
  'emily-rodriguez': {
    _id: 'author-emily-rodriguez',
    name: 'Emily Rodriguez',
    slug: { current: 'emily-rodriguez' },
    bio: 'Emily Rodriguez covers the banking industry, with a focus on digital transformation, bank–fintech partnerships and consumer protection rulemaking.',
    imageUrl: avatar('photo-1573497019940-1c28c88b4f3e'),
  },
  'alex-nakamura': {
    _id: 'author-alex-nakamura',
    name: 'Alex Nakamura',
    slug: { current: 'alex-nakamura' },
    bio: 'Alex Nakamura reports on blockchain engineering — Ethereum protocol upgrades, Layer 2 scaling and the economics of validator networks.',
    imageUrl: avatar('photo-1500648767791-00dcc994a43e'),
  },
  'jennifer-walsh': {
    _id: 'author-jennifer-walsh',
    name: 'Jennifer Walsh',
    slug: { current: 'jennifer-walsh' },
    bio: 'Jennifer Walsh covers housing, mortgage markets and household balance sheets. She holds a degree in urban economics from MIT.',
    imageUrl: avatar('photo-1607746882042-944635dfe10e'),
  },
  'priya-raman': {
    _id: 'author-priya-raman',
    name: 'Priya Raman',
    slug: { current: 'priya-raman' },
    bio: 'Priya Raman is a commodities and energy markets reporter, tracking crude, metals and the capital cycle behind the US industrial build-out.',
    imageUrl: avatar('photo-1531746020798-e6953c6e8e04'),
  },
  'robert-feldman': {
    _id: 'author-robert-feldman',
    name: 'Robert Feldman',
    slug: { current: 'robert-feldman' },
    bio: 'Robert Feldman is Coinscribed’s regulation editor. He spent 14 years as a securities attorney before moving to financial journalism.',
    imageUrl: avatar('photo-1560250097-0b93528c311a'),
  },
  'danielle-whitfield': {
    _id: 'author-danielle-whitfield',
    name: 'Danielle Whitfield',
    slug: { current: 'danielle-whitfield' },
    bio: 'Danielle Whitfield reports on payments, consumer credit and the retail side of American banking — from overdraft policy to instant settlement.',
    imageUrl: avatar('photo-1573497019418-b400bb3ab074'),
  },
  'marcus-ellison': {
    _id: 'author-marcus-ellison',
    name: 'Marcus Ellison',
    slug: { current: 'marcus-ellison' },
    bio: 'Marcus Ellison covers labor markets, fiscal policy and the data releases that move Washington and Wall Street in the same afternoon.',
    imageUrl: avatar('photo-1615813967515-e1838c1c5116'),
  },
}

// ============================================================
// Body authoring format -> Portable Text
// ============================================================

/**
 * A compact authoring format for article bodies. It is converted to real
 * Portable Text blocks by `buildBody`, so the detail page renderer receives
 * exactly the same shape it would get from Sanity.
 */
type BodyNode =
  | { p: string }
  | { h2: string }
  | { quote: string }
  | { ul: string[] }
  | { ol: string[] }

function textBlock(
  key: string,
  text: string,
  style: string,
  listItem?: 'bullet' | 'number'
): PortableTextBlock {
  return {
    _key: key,
    _type: 'block',
    style,
    ...(listItem ? { listItem, level: 1 } : {}),
    children: [{ _key: `${key}-s`, _type: 'span', text, marks: [] }],
    markDefs: [],
  }
}

function buildBody(nodes: BodyNode[]): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = []

  nodes.forEach((node, index) => {
    const key = `b${index}`

    if ('h2' in node) {
      blocks.push(textBlock(key, node.h2, 'h2'))
      return
    }
    if ('quote' in node) {
      blocks.push(textBlock(key, node.quote, 'blockquote'))
      return
    }
    if ('ul' in node) {
      node.ul.forEach((item, i) =>
        blocks.push(textBlock(`${key}-${i}`, item, 'normal', 'bullet'))
      )
      return
    }
    if ('ol' in node) {
      node.ol.forEach((item, i) =>
        blocks.push(textBlock(`${key}-${i}`, item, 'normal', 'number'))
      )
      return
    }
    blocks.push(textBlock(key, node.p, 'normal'))
  })

  return blocks
}

// ============================================================
// Article seeds
// ============================================================

interface ArticleSeed {
  /** Numeric suffix used to build a stable `_id`. */
  n: number
  title: string
  slug: string
  excerpt: string
  category: 'crypto' | 'economy' | 'markets' | 'banking'
  author: AuthorKey
  publishedAt: string
  readingTime: number
  /** Unsplash photo id — one distinct photograph per story. */
  photo: string
  body: BodyNode[]
}

const articleSeeds: ArticleSeed[] = [

  // ------------------------------------------------------------ crypto (11)
  {
    n: 1,
    title: 'Bitcoin Tops $120,000 as Spot ETF Inflows Hit a Weekly Record',
    slug: 'bitcoin-tops-120000-spot-etf-inflows-record',
    excerpt:
      'Bitcoin cleared $120,000 for the first time after US spot ETFs absorbed $4.8 billion in a single week, the strongest stretch of net creations since the funds launched.',
    category: 'crypto',
    author: 'michael-torres',
    publishedAt: '2026-09-01T13:10:00Z',
    readingTime: 7,
    photo: 'photo-1516245834210-c4c142787335',
    body: [
      {
        p: 'Bitcoin traded above $120,000 for the first time on Tuesday morning, extending a rally that has been driven less by retail enthusiasm than by the quiet, mechanical accumulation of US exchange-traded funds. Spot Bitcoin ETFs took in a net $4.8 billion over the previous five sessions — the heaviest week of creations since the products began trading — and now hold roughly 1.4 million coins between them.',
      },
      {
        p: 'The move has been notably orderly. Realised volatility over the past 30 days sits near the bottom of its three-year range, and funding rates on perpetual futures have stayed close to neutral, suggesting the advance is being financed by cash buyers rather than leverage.',
      },
      { h2: 'Where the demand is coming from' },
      {
        p: 'Filings reviewed by Coinscribed show a widening base of institutional holders. Registered investment advisers now account for the largest share of reported ETF positions, overtaking hedge funds for the first time. Several state pension systems have also disclosed small allocations, typically between 0.5% and 1.5% of total assets, framed internally as an inflation hedge rather than a growth bet.',
      },
      {
        quote:
          'The marginal buyer has changed. Two years ago it was a trader with a leveraged position and a three-week time horizon. Today it is an allocator rebalancing a model portfolio once a quarter, and that buyer does not sell on a 10% drawdown.',
      },
      {
        p: 'Supply dynamics have amplified the effect. Exchange balances have fallen to their lowest level since 2018, and the share of coins that have not moved in more than five years continues to grind higher. With issuance cut again at the most recent halving, the float available to absorb ETF demand is structurally smaller than in any previous cycle.',
      },
      { h2: 'What could interrupt the trend' },
      {
        p: 'Analysts flag three risks that could stall the advance:',
      },
      {
        ul: [
          'A liquidity shock in traditional markets, which historically forces indiscriminate selling across risk assets regardless of crypto-specific fundamentals.',
          'Tax-driven profit taking by long-term holders, particularly around the US year-end, when realised gains become a planning decision rather than a market view.',
          'Concentration risk in the ETF complex itself, where a handful of authorised participants handle the majority of creations and redemptions.',
        ],
      },
      {
        p: 'For now, positioning looks unusually clean. Open interest relative to market capitalisation remains below the peaks of the previous two cycles, and options markets are pricing a comparatively modest premium for upside calls. That combination has historically preceded slower, longer advances rather than the vertical melt-ups that end in forced liquidation.',
      },
    ],
  },
  {
    n: 2,
    title: 'Ethereum’s Fusaka Upgrade Cuts Rollup Data Costs Nearly in Half',
    slug: 'ethereum-fusaka-upgrade-cuts-rollup-data-costs',
    excerpt:
      'The latest Ethereum hard fork expanded blob capacity and introduced peer-level data sampling, pushing median Layer 2 transaction fees below a tenth of a cent.',
    category: 'crypto',
    author: 'alex-nakamura',
    publishedAt: '2026-08-30T15:30:00Z',
    readingTime: 8,
    photo: 'photo-1639762681485-074b7f938ba0',
    body: [
      {
        p: 'Ethereum activated its Fusaka upgrade at epoch boundary on Sunday, raising the number of data blobs each block can carry and shipping the first production implementation of peer data availability sampling. Within hours, median transaction fees across the largest Layer 2 networks had fallen from roughly $0.008 to under $0.001.',
      },
      {
        p: 'The change matters because rollups do not pay for computation on Ethereum — they pay to publish compressed transaction data. Blob space is that data market, and for the past two years it has been the binding constraint on how cheap a rollup transaction can get.',
      },
      { h2: 'Sampling instead of downloading' },
      {
        p: 'Under the previous design, every node had to download every blob to verify availability. Fusaka replaces that with sampling: a node requests a small, randomly chosen subset of each blob and relies on erasure coding to reconstruct the whole if needed. The security assumption shifts from “everyone sees everything” to “enough nodes see enough pieces”, which is a far cheaper property to buy.',
      },
      {
        p: 'The practical result is that capacity can grow without pushing hardware requirements onto ordinary validators — the failure mode that has historically pushed blockchains toward centralisation. Client teams reported no measurable increase in home-staker bandwidth during the first 48 hours of mainnet operation.',
      },
      {
        quote:
          'We spent a decade arguing about block size. Sampling ends that argument by decoupling how much data the network carries from how much data any single participant must hold.',
      },
      { h2: 'Second-order effects' },
      {
        p: 'Cheaper data has already changed application design. Two of the largest perpetuals venues have moved order-book updates on-chain, something that was economically impossible a year ago. Consumer applications with high transaction counts and low value per transaction — loyalty points, in-game economies, micro-payments for API access — are the next obvious candidates.',
      },
      {
        p: 'There is a revenue question underneath the celebration. Blob fees now contribute a smaller share of the burn that offsets new ETH issuance, and net supply has drifted slightly inflationary in recent weeks. Protocol researchers argue this is the correct trade: capturing value at the base layer matters less than making the base layer indispensable, and settlement demand tends to follow activity with a lag.',
      },
    ],
  },
  {
    n: 3,
    title: 'Stablecoin Supply Crosses $300 Billion as Payment Rails Go Mainstream',
    slug: 'stablecoin-supply-crosses-300-billion-payment-rails',
    excerpt:
      'Dollar-pegged tokens now settle more monthly volume than several card networks, and US payroll providers have begun offering stablecoin disbursement as a standard option.',
    category: 'crypto',
    author: 'michael-torres',
    publishedAt: '2026-08-27T14:40:00Z',
    readingTime: 6,
    photo: 'photo-1591994843349-f415893b3a6b',
    body: [
      {
        p: 'The total supply of dollar-denominated stablecoins passed $300 billion this week, roughly tripling in three years. The growth is no longer coming primarily from crypto trading. Corporate treasury operations, cross-border payroll and merchant settlement now account for an estimated 41% of transfer volume, according to on-chain analysis of tagged addresses.',
      },
      { h2: 'From trading collateral to plumbing' },
      {
        p: 'Stablecoins began as a way to hold dollars on an exchange over a weekend. Their comparative advantage turned out to be more general: final settlement in seconds, at negligible cost, at any hour, without a correspondent bank in the middle. For a US company paying contractors in eleven countries, that is a meaningful operational upgrade over wires that clear in two days and lose 3% to intermediaries.',
      },
      {
        p: 'Three of the largest US payroll platforms now list stablecoin disbursement alongside direct deposit. Adoption is concentrated among firms with distributed workforces, but the mere presence of the option in mainstream software is a step-change in distribution.',
      },
      {
        quote:
          'Nobody chooses a payment rail because it is interesting. They choose it because it is cheaper, faster and it works on a Sunday. Stablecoins finally clear all three bars for a normal finance team.',
      },
      { h2: 'Regulatory clarity did the heavy lifting' },
      {
        p: 'Federal stablecoin legislation passed last year gave issuers a defined path: full reserve backing in short-dated Treasuries and central bank deposits, monthly attestations, and a redemption guarantee at par within one business day. That framework converted a compliance question into a procurement question, and bank risk committees began approving stablecoin exposure accordingly.',
      },
      {
        p: 'The concentration of reserves in Treasury bills has drawn its own scrutiny. Large issuers are now among the more significant holders of short-dated US government debt, which means a rapid contraction in stablecoin supply would translate into forced selling at the front end of the curve. Regulators have asked for stress-testing disclosures beginning next quarter.',
      },
    ],
  },
  {
    n: 4,
    title: 'SEC Clears the First Multi-Asset Crypto Index ETF',
    slug: 'sec-clears-first-multi-asset-crypto-index-etf',
    excerpt:
      'The approval lets a single fund hold Bitcoin, Ether and three large-cap tokens under one wrapper, with quarterly rebalancing and in-kind creations.',
    category: 'crypto',
    author: 'robert-feldman',
    publishedAt: '2026-08-24T13:25:00Z',
    readingTime: 5,
    photo: 'photo-1589829545856-d10d557cf95f',
    body: [
      {
        p: 'The Securities and Exchange Commission approved the first multi-asset crypto index ETF on Monday, ending a two-year review. The fund tracks a capitalisation-weighted basket of five digital assets, rebalanced quarterly, with a 25% cap on any single constituent and in-kind creation and redemption for authorised participants.',
      },
      {
        p: 'Single-asset spot funds have existed since 2024, but every attempt at a diversified wrapper had stalled on the same question: whether surveillance-sharing agreements covering Bitcoin and Ether could be extended to smaller tokens with thinner regulated futures markets.',
      },
      { h2: 'How the impasse was resolved' },
      {
        p: 'The approved structure sidesteps the problem with a liquidity screen. A token qualifies for the index only if it has maintained a minimum of $500 million in average daily volume across surveilled venues for six consecutive months, and it is removed automatically if it falls below that threshold for 30 days. Eligibility becomes a mechanical test rather than a discretionary judgement by the sponsor.',
      },
      {
        quote:
          'The Commission did not decide that these assets are safe. It decided that a rules-based liquidity filter is auditable, and that is a much narrower thing to sign off on.',
      },
      { h2: 'What advisers are likely to do with it' },
      {
        p: 'Distribution is the real prize. Model portfolios used by wirehouses and independent advisory platforms generally cannot accommodate five separate tickers for a 2% sleeve. One diversified line item with a published methodology fits existing paperwork, and several platforms have already indicated they will add the fund to their approved lists next quarter.',
      },
      {
        p: 'Fee competition should follow quickly. The launch carries a 0.65% expense ratio, well above the 0.19% average for single-asset spot Bitcoin funds. Two rival sponsors with pending applications have signalled they will undercut it, and the Commission’s order provides a template that materially shortens their path.',
      },
    ],
  },
  {
    n: 5,
    title: 'US Bitcoin Miners Pivot to AI Data Centers as Hosting Margins Widen',
    slug: 'us-bitcoin-miners-pivot-ai-data-centers-hosting',
    excerpt:
      'Listed mining companies are converting megawatts to GPU hosting contracts, where revenue per kilowatt is running at four to six times what hashing currently pays.',
    category: 'crypto',
    author: 'priya-raman',
    publishedAt: '2026-08-19T15:05:00Z',
    readingTime: 7,
    photo: 'photo-1591488320449-011701bb6704',
    body: [
      {
        p: 'The five largest US-listed Bitcoin miners have now committed a combined 2.1 gigawatts of contracted power to artificial intelligence workloads rather than hashing, according to filings compiled by Coinscribed. In every case the economics are the same: a signed GPU hosting agreement generates four to six times the revenue per kilowatt that mining produces at current difficulty.',
      },
      { h2: 'The asset was never the machines' },
      {
        p: 'Mining companies spent a decade acquiring something scarcer than ASICs — interconnection agreements. Securing 300 megawatts at an attractive power price, with grid approval and substation capacity in place, takes years. When a hyperscaler needs that capacity immediately, the queue position itself becomes the product.',
      },
      {
        p: 'The conversion is not free. AI racks require liquid cooling, far higher redundancy and network latency guarantees that a mining shed was never designed to deliver. Capital expenditure runs between $7 million and $12 million per megawatt for retrofits, against roughly $1 million for mining-grade buildout.',
      },
      {
        quote:
          'We did not become an AI company. We were always an energy infrastructure company that happened to sell its electricity to the highest bidder, and the bidder changed.',
      },
      { h2: 'Consequences for the network' },
      {
        p: 'Aggregate hashrate growth has flattened for the first time since 2021 as marginal capacity is redirected. That mechanically improves margins for miners who stay, because difficulty adjusts downward when hashrate leaves. The result is an unusually stable equilibrium: mining remains profitable precisely because the most flexible operators keep leaving.',
      },
      {
        p: 'For investors, the disclosure quality has improved sharply. Companies now report contracted hosting revenue with defined terms and counterparties, which supports a very different valuation approach than an implied bet on the Bitcoin price. Two of the five now trade at multiples closer to data centre REITs than to crypto equities.',
      },
    ],
  },
  {
    n: 6,
    title: 'Tokenized Treasury Funds Pass $12 Billion as Corporates Park Cash On-Chain',
    slug: 'tokenized-treasury-funds-pass-12-billion',
    excerpt:
      'On-chain money market products now offer same-day subscriptions and 24-hour redemption, drawing treasury balances from crypto-native firms and traditional companies alike.',
    category: 'crypto',
    author: 'david-park',
    publishedAt: '2026-08-06T15:45:00Z',
    readingTime: 6,
    photo: 'photo-1544197150-b99a580bb7a8',
    body: [
      {
        p: 'Tokenized US Treasury funds crossed $12 billion in assets this month, up from under $1 billion two years ago. The products are structurally unremarkable — short-dated government debt in a registered fund — but the transfer agent is a blockchain, and that changes the operational profile enough to matter.',
      },
      { h2: 'Why the wrapper matters' },
      {
        p: 'A conventional money market fund settles subscriptions and redemptions on a next-day cycle and stops accepting orders in the early afternoon. A tokenized fund can settle atomically against a stablecoin at any hour, which means idle cash never has to sit uninvested over a weekend or a holiday.',
      },
      {
        p: 'For firms that already hold stablecoin balances, the yield differential is decisive. Holding $200 million in a non-interest-bearing token instead of a tokenized Treasury fund forgoes roughly $8 million a year at current front-end rates. Treasurers describe the switch as the least controversial decision on their list.',
      },
      {
        quote:
          'Every treasury team runs the same calculation. If the credit risk is Treasury bills either way and one version pays me and settles instantly, the meeting is very short.',
      },
      { h2: 'Collateral is the next frontier' },
      {
        p: 'Derivatives clearing houses have begun accepting tokenized Treasury shares as initial margin, which lets a trading desk earn front-end yield on collateral that previously sat as cash. Two large crypto derivatives venues now support it, and one traditional clearing house has opened a pilot.',
      },
      {
        p: 'The remaining friction is legal rather than technical. Transfer restrictions, qualified-purchaser gates and jurisdiction-specific holding rules are enforced by permissioned smart contracts, which limits composability with open DeFi protocols. Most issuers regard that as a feature, not a bug — and as the price of keeping the products inside existing securities law.',
      },
    ],
  },
  {
    n: 7,
    title: 'Solana Throughput Doubles After Validator Client Overhaul',
    slug: 'solana-throughput-doubles-validator-client-overhaul',
    excerpt:
      'A rewritten networking layer pushed sustained mainnet capacity past 100,000 transactions per second in production, with block times steady under load.',
    category: 'crypto',
    author: 'alex-nakamura',
    publishedAt: '2026-08-11T16:30:00Z',
    readingTime: 6,
    photo: 'photo-1558494949-ef010cbdcc31',
    body: [
      {
        p: 'Solana validators completed a staged migration to a rewritten client this month, and the network has since sustained over 100,000 transactions per second during peak periods without the block-time degradation that characterised earlier congestion events.',
      },
      { h2: 'Client diversity as an engineering goal' },
      {
        p: 'The upgrade matters for reliability as much as speed. For most of its history Solana ran a single dominant validator implementation, which meant a single bug could halt the chain — and twice did. A second independent client, built from the specification rather than forked from the original, removes that correlated failure mode.',
      },
      {
        p: 'The performance gains come mostly from the transaction ingestion path. Instead of every validator receiving every transaction and racing to deduplicate, the new design routes transactions to the current leader through a scheduled path, which sharply reduces wasted bandwidth during demand spikes.',
      },
      {
        quote:
          'Two clients written by two teams is worth more than a 10x speedup. Speed is a feature; independent implementations are insurance.',
      },
      { h2: 'What is being built on the headroom' },
      {
        p: 'The applications taking advantage of the capacity are concentrated in high-frequency use cases: central limit order books, on-chain market making, and payment processors handling retail card-adjacent volume. Several consumer payment firms have begun settling merchant batches on the network, citing sub-cent fees and one-second finality.',
      },
      {
        p: 'The trade-off remains hardware. Running a competitive validator requires substantially more compute and bandwidth than on lower-throughput networks, which keeps the operator set professional rather than hobbyist. Whether that concentration matters is the central open question about the design.',
      },
    ],
  },
  {
    n: 8,
    title: 'New Custody Rules Let Regional Banks Hold Crypto for Clients',
    slug: 'new-custody-rules-regional-banks-hold-crypto',
    excerpt:
      'Federal guidance replaced case-by-case approvals with a published control framework, and eleven banks below $100 billion in assets have already filed to launch custody desks.',
    category: 'crypto',
    author: 'robert-feldman',
    publishedAt: '2026-08-09T15:45:00Z',
    readingTime: 5,
    photo: 'photo-1633265486064-086b219458ec',
    body: [
      {
        p: 'Federal banking regulators published final custody guidance last week that lets any adequately capitalised institution hold digital assets on behalf of clients, provided it meets a defined set of key management, segregation and audit controls. The previous regime required individual supervisory sign-off, which in practice limited the business to a handful of trust banks.',
      },
      { h2: 'What the framework actually requires' },
      {
        p: 'The guidance is prescriptive where it counts and silent where it does not. Institutions must demonstrate quorum-based key generation with geographically separated shards, client asset segregation with per-client on-chain attestation, an independent annual controls audit, and a documented incident response plan with defined recovery time objectives.',
      },
      {
        p: 'Notably, it does not mandate a particular technology. Hardware security modules, multi-party computation and multisignature arrangements all qualify if the control objectives are met, which leaves room for vendors to compete on implementation.',
      },
      {
        quote:
          'For four years the answer to “can we custody this?” was “ask your examiner”. Now it is a checklist. That is the entire difference between a pilot and a product line.',
      },
      { h2: 'Regional banks move first' },
      {
        p: 'Eleven banks with under $100 billion in assets have filed notices of intent, most citing demand from wealth management clients who currently hold digital assets at exchanges and would prefer them alongside the rest of their balance sheet. Several plan to launch through a shared sub-custodian rather than building in-house.',
      },
      {
        p: 'Fee expectations are modest — 25 to 50 basis points annually, well below early crypto-native custody pricing. The strategic logic is defensive: banks would rather custody the asset at a thin margin than watch a client relationship migrate to a platform that also offers lending and payments.',
      },
    ],
  },
  {
    n: 9,
    title: 'DeFi Lending Rebounds to $95 Billion With Fixed-Rate Products Leading',
    slug: 'defi-lending-rebounds-95-billion-fixed-rate',
    excerpt:
      'Total value locked in decentralized credit markets returned to its 2021 peak, but the composition has shifted decisively toward term loans and predictable pricing.',
    category: 'crypto',
    author: 'michael-torres',
    publishedAt: '2026-08-01T14:50:00Z',
    readingTime: 6,
    photo: 'photo-1558655146-9f40138edfeb',
    body: [
      {
        p: 'Value locked in decentralized lending protocols has returned to $95 billion, matching the previous cycle peak. The headline number conceals a more interesting change: roughly 38% of outstanding loans now carry a fixed rate and a defined maturity, against under 5% in 2021.',
      },
      { h2: 'Floating rates were a design accident' },
      {
        p: 'Early DeFi lending used utilisation-based variable rates because they were simple to implement and required no order book. The consequence was that borrowing costs could triple in an afternoon, which made the products unusable for anyone financing a real position rather than a short-term trade.',
      },
      {
        p: 'Fixed-rate designs solve this by matching lenders and borrowers at a clearing rate for a set term, typically through periodic auctions or by tokenising the yield and principal separately. Institutional desks that had written off DeFi credit have re-engaged, because a known cost of funds for 90 days is something a risk committee can approve.',
      },
      {
        quote:
          'No treasurer can run a book where the funding rate is a function of what other people did in the last ten minutes. Term structure is not a nicety, it is the precondition for institutional participation.',
      },
      { h2: 'Risk has concentrated elsewhere' },
      {
        p: 'Collateral quality has improved — tokenized Treasuries and blue-chip assets dominate — but the reliance on a small number of oracle providers and cross-chain bridges has grown. The largest three protocols share overlapping price feed dependencies, meaning a single oracle failure could trigger correlated liquidations across venues that appear independent.',
      },
      {
        p: 'Several protocols have responded with circuit breakers that pause liquidations when price sources diverge beyond a threshold. It is a pragmatic fix that trades some capital efficiency for resilience, and one that mirrors how traditional exchanges handle disorderly markets.',
      },
    ],
  },
  {
    n: 10,
    title: 'Brokerages Add Staking to Retirement Accounts After Guidance Shift',
    slug: 'brokerages-add-staking-retirement-accounts-guidance',
    excerpt:
      'Updated Labor Department language cleared the way for staking rewards inside self-directed IRAs, and two large custodians have begun offering it by default.',
    category: 'crypto',
    author: 'emily-rodriguez',
    publishedAt: '2026-07-28T15:10:00Z',
    readingTime: 5,
    photo: 'photo-1512941937669-90a1b58e7e9c',
    body: [
      {
        p: 'Two large US custodians began offering staking inside self-directed individual retirement accounts this month, following updated Labor Department guidance that treats validator rewards as investment income rather than as a prohibited transaction.',
      },
      { h2: 'The question was never the yield' },
      {
        p: 'Staking mechanics are straightforward: an asset holder commits tokens to help secure a proof-of-stake network and receives protocol-issued rewards. Inside a tax-advantaged account, the obstacle was whether directing the asset to a validator constituted the account holder providing a service to their own plan — a structural prohibition that has nothing to do with crypto.',
      },
      {
        p: 'The revised guidance resolves it by distinguishing between a holder who operates validator infrastructure and one who delegates to an unaffiliated operator through their custodian. The second case is treated like any other custodial income arrangement.',
      },
      {
        quote:
          'Retirement accounts hold the majority of long-duration household savings in this country. Any asset that cannot live inside one is permanently a satellite position.',
      },
      { h2: 'Practical constraints remain' },
      {
        p: 'Unstaking queues introduce a liquidity mismatch that account rules were not written for. Required minimum distributions arrive on a fixed schedule; exit queues on some networks can run several days or longer during periods of heavy activity. Custodians are managing this with liquidity buffers and by capping the staked share of any single account.',
      },
      {
        p: 'Fee disclosure is the other watch item. Early offerings retain between 15% and 25% of gross rewards, a spread that is substantial relative to index fund pricing and not always presented clearly alongside the advertised yield.',
      },
    ],
  },
  {
    n: 11,
    title: 'Mining Difficulty Hits Record as Efficiency Gains Outrun the Halving',
    slug: 'mining-difficulty-record-efficiency-gains-halving',
    excerpt:
      'Next-generation chips at sub-12 joules per terahash have kept the Bitcoin network expanding despite a halved block subsidy and flat energy prices.',
    category: 'crypto',
    author: 'priya-raman',
    publishedAt: '2026-07-23T16:05:00Z',
    readingTime: 6,
    photo: 'photo-1518770660439-4636190af475',
    body: [
      {
        p: 'Bitcoin mining difficulty set a record at the most recent adjustment, confirming that hashrate has continued to expand even after the block subsidy was halved. The explanation is almost entirely on the hardware side: the newest generation of application-specific chips operates below 12 joules per terahash, roughly a 40% efficiency improvement over the fleet they are replacing.',
      },
      { h2: 'Efficiency is the only real variable' },
      {
        p: 'Mining economics reduce to a single comparison: the energy cost of producing a unit of hashrate against the revenue that unit earns. Because difficulty adjusts to keep block times constant, no operator can outrun the network by adding machines. The only durable advantage is producing hashrate more cheaply than the marginal competitor.',
      },
      {
        p: 'That has driven relentless consolidation. Operators with power contracts above roughly five cents per kilowatt-hour and older equipment have been squeezed out, while those with hydro, stranded gas or curtailment arrangements have expanded. The five largest public miners now account for an estimated 29% of global hashrate, up from 18% three years ago.',
      },
      {
        quote:
          'There is no clever strategy in mining. You either have cheaper electricity and newer machines than the person on the other side of the difficulty adjustment, or you are subsidising them.',
      },
      { h2: 'Grid operators have noticed' },
      {
        p: 'Large miners have become useful to system operators precisely because their load is interruptible. Demand response agreements now contribute a meaningful share of revenue for several operators, who are paid to curtail within seconds during peak strain — a service that conventional industrial load cannot provide.',
      },
      {
        p: 'The arrangement has changed the political conversation in several states, where mining is now discussed alongside battery storage as a flexibility resource rather than purely as a consumer of capacity.',
      },
    ],
  },

  // ----------------------------------------------------------- economy (11)
  {
    n: 12,
    title: 'Fed Cuts Rates a Quarter Point and Signals One More Move This Year',
    slug: 'fed-cuts-rates-quarter-point-signals-one-more',
    excerpt:
      'The FOMC lowered its target range to 3.50%–3.75% in a near-unanimous vote, with the updated projections pointing to a single additional cut before December.',
    category: 'economy',
    author: 'sarah-chen',
    publishedAt: '2026-09-01T09:45:00Z',
    readingTime: 6,
    photo: 'photo-1633059050703-0f1b50828402',
    body: [
      {
        p: 'The Federal Open Market Committee cut its benchmark rate by 25 basis points to a target range of 3.50% to 3.75%, its second reduction of the year. One member dissented in favour of holding. The updated summary of economic projections shows a median expectation of one further cut before the end of December.',
      },
      { h2: 'A committee arguing about the destination, not the direction' },
      {
        p: 'The statement dropped its reference to inflation being “somewhat elevated”, a phrase that had survived eleven consecutive meetings. In its place is language describing price pressures as broadly consistent with the 2% objective — the clearest signal yet that the disinflation debate inside the committee has been settled.',
      },
      {
        p: 'What remains contested is the terminal rate. The dispersion in individual projections for end-2027 is unusually wide, spanning 2.50% to 3.75%. That range reflects genuine disagreement about whether the neutral rate has drifted higher since the pandemic, a question no amount of incoming data will resolve quickly.',
      },
      {
        quote:
          'We are no longer restrictive by any reasonable estimate, and we are not stimulative either. From here the committee is calibrating, not correcting.',
      },
      { h2: 'Market reaction was muted by design' },
      {
        p: 'Two-year Treasury yields fell four basis points and the S&P 500 closed 0.3% higher — an unremarkable response that officials will read as a success. The cut had been fully priced for six weeks, and the Chair’s recent public remarks had deliberately narrowed the range of plausible outcomes.',
      },
      {
        p: 'The transmission that matters most is in credit. Thirty-year mortgage rates have already fallen more than a full point from their peak, and revolving consumer credit costs are beginning to follow with the usual lag. Corporate refinancing activity has picked up sharply, with a record volume of investment-grade issuance in the past four weeks.',
      },
    ],
  },
  {
    n: 13,
    title: 'CPI Cools to 2.1% as Shelter Inflation Finally Breaks',
    slug: 'cpi-cools-to-2-1-percent-shelter-inflation-breaks',
    excerpt:
      'Headline consumer prices rose 2.1% year over year, with the shelter component posting its smallest twelve-month increase since 2021.',
    category: 'economy',
    author: 'marcus-ellison',
    publishedAt: '2026-08-29T11:15:00Z',
    readingTime: 5,
    photo: 'photo-1446776653964-20c1d3a81b06',
    body: [
      {
        p: 'The Consumer Price Index rose 0.1% in the month and 2.1% over the past year, the softest annual reading since early 2021. Core CPI, which strips out food and energy, came in at 2.3%. The decisive contributor was shelter, up just 2.8% year over year after spending most of the past three years above 5%.',
      },
      { h2: 'Why shelter took so long' },
      {
        p: 'Shelter accounts for roughly a third of the CPI basket and is measured through rents, including an imputed rent for owner-occupied homes. Because leases reset annually, the index reflects market rents with a lag of twelve to eighteen months. Market rent growth stalled in 2024; the official data has only now caught up.',
      },
      {
        p: 'The mechanical implication is that a large share of the remaining disinflation was already in the pipeline regardless of monetary policy. Economists who argued for patience on that basis have been vindicated, though the debate over how much of the earlier surge was demand-driven is unlikely to be resolved.',
      },
      {
        quote:
          'Two thirds of the inflation fight was fought and won in the rental market eighteen months before it showed up in the statistics.',
      },
      { h2: 'Where price pressure persists' },
      {
        p: 'Services excluding shelter remain the sticky component, running near 3.2%. The drivers are concentrated in categories with heavy labour content and limited productivity growth:',
      },
      {
        ul: [
          'Motor vehicle insurance, still adjusting to higher repair and replacement costs.',
          'Medical services, where negotiated rates reset annually and reflect prior-year wage growth.',
          'Personal care and recreation services, where wage gains pass through to prices almost directly.',
        ],
      },
      {
        p: 'Goods prices, by contrast, have been outright deflationary for four consecutive months. New and used vehicle prices continue to normalise as inventories rebuild, and apparel has fallen year over year.',
      },
    ],
  },
  {
    n: 14,
    title: 'Payrolls Add 165,000 as Unemployment Holds at 4.2%',
    slug: 'payrolls-add-165000-unemployment-holds-4-2-percent',
    excerpt:
      'Hiring came in close to consensus with healthcare and construction leading, while average hourly earnings decelerated to 3.4% year over year.',
    category: 'economy',
    author: 'marcus-ellison',
    publishedAt: '2026-08-26T10:05:00Z',
    readingTime: 4,
    photo: 'photo-1449824913935-59a10b8d2000',
    body: [
      {
        p: 'The US economy added 165,000 nonfarm payroll jobs last month, close to the 170,000 consensus, and the unemployment rate held at 4.2% for the fourth consecutive month. Average hourly earnings rose 0.2% on the month and 3.4% over the year, the slowest annual pace since 2020.',
      },
      { h2: 'A labour market cooling without cracking' },
      {
        p: 'The composition is reassuring. Private education and health services added 58,000 positions, construction contributed 21,000 on the back of infrastructure and data centre activity, and manufacturing was roughly flat after five months of small declines. Temporary help services, a reliable leading indicator, rose slightly after a long stretch of contraction.',
      },
      {
        p: 'Labour force participation ticked up a tenth to 62.8%, meaning the stable unemployment rate came alongside more people looking for work rather than fewer. That combination is what a soft landing looks like in the data.',
      },
      {
        quote:
          'Wage growth at 3.4% with productivity near 1.5% is fully consistent with 2% inflation. This is the report the committee wanted and did not expect to get this cleanly.',
      },
      { h2: 'The revisions question' },
      {
        p: 'Prior-month figures were revised down by a combined 24,000, continuing a pattern of modest negative revisions that has persisted for over a year. The birth-death model used to estimate new business formation has been running ahead of the eventual benchmark, which tends to overstate initial prints during periods when small business formation is slowing.',
      },
    ],
  },
  {
    n: 15,
    title: 'Congress Passes Two-Year Budget Deal, Averting a Shutdown',
    slug: 'congress-passes-two-year-budget-deal-averting-shutdown',
    excerpt:
      'The agreement sets discretionary caps through fiscal 2028 and suspends the debt limit, removing two recurring sources of market volatility.',
    category: 'economy',
    author: 'marcus-ellison',
    publishedAt: '2026-08-22T11:40:00Z',
    readingTime: 5,
    photo: 'photo-1529107386315-e1a2ed48a620',
    body: [
      {
        p: 'Congress approved a two-year budget agreement late Friday, setting discretionary spending caps through fiscal 2028 and suspending the statutory debt limit for the same period. The vote removes the immediate prospect of a shutdown and, more consequentially for markets, takes a debt-ceiling standoff off the calendar until after the next presidential term begins.',
      },
      { h2: 'What is actually in it' },
      {
        p: 'Non-defence discretionary spending grows 1.9% annually, slightly below the projected rate of inflation, while defence receives 3.1%. The package includes a modest expansion of the child tax credit, extends expiring energy manufacturing incentives at reduced rates, and offsets part of the cost through changes to pharmaceutical price negotiation.',
      },
      {
        p: 'The Congressional Budget Office scores the agreement as reducing deficits by $340 billion over ten years relative to baseline — a meaningful figure that nonetheless leaves debt-to-GDP on a rising path.',
      },
      {
        quote:
          'This deal buys predictability, not solvency. Predictability is worth a great deal to markets, and it is the only thing on the table that both chambers could pass.',
      },
      { h2: 'The Treasury market response' },
      {
        p: 'Bill yields maturing around the previous deadline normalised immediately, erasing the small risk premium that had built up over the summer. Longer-dated yields were essentially unchanged, reflecting a view that the deal alters the timing of fiscal risk rather than its trajectory.',
      },
      {
        p: 'Treasury indicated it will rebuild its cash balance over the coming weeks, implying elevated bill issuance that money market funds are widely expected to absorb without difficulty given the size of balances currently parked in government funds.',
      },
    ],
  },
  {
    n: 16,
    title: 'Port Volumes Signal the End of Tariff Front-Running',
    slug: 'port-volumes-signal-end-of-tariff-front-running',
    excerpt:
      'Container throughput at the largest US gateways fell 9% year over year as importers work through inventory built ahead of last year’s duty changes.',
    category: 'economy',
    author: 'priya-raman',
    publishedAt: '2026-08-18T12:30:00Z',
    readingTime: 6,
    photo: 'photo-1605745341112-85968b19335b',
    body: [
      {
        p: 'Loaded import volumes at the ten largest US container ports fell 9% year over year last month, the sharpest decline outside a recession in more than a decade. The drop is not a demand signal. It is the mirror image of the surge that preceded last year’s tariff schedule changes, when importers pulled forward shipments to beat the effective date.',
      },
      { h2: 'Reading through the distortion' },
      {
        p: 'Inventory-to-sales ratios at general merchandise retailers remain roughly 8% above their pre-announcement average, which is consistent with warehouses still holding goods brought in early. Retail sales over the same period have been steady, confirming that the shipping slowdown reflects working down stock rather than weakening consumption.',
      },
      {
        p: 'Freight rates tell the same story. Trans-Pacific spot rates have fallen back to levels last seen in 2023 after spiking during the pull-forward, and carriers have resumed blanking sailings to manage capacity.',
      },
      {
        quote:
          'If you buy fourteen months of inventory in four months, the next four months look like a recession in the shipping data and like nothing at all in the sales data.',
      },
      { h2: 'What comes next' },
      {
        p: 'Forecasters expect volumes to normalise by the fourth quarter as excess stock clears. The more durable change is in sourcing. Import share from Southeast Asia and Mexico has continued to rise at the expense of a single dominant supplier, and that shift has held through periods when the tariff differential narrowed — suggesting it reflects a genuine reassessment of concentration risk rather than pure cost arbitrage.',
      },
      {
        p: 'For the Gulf and East Coast ports that have absorbed much of the rerouted volume, the reshuffling has justified multi-billion-dollar dredging and terminal programmes that looked speculative five years ago.',
      },
    ],
  },
  {
    n: 17,
    title: 'Consumer Sentiment Rebounds to a Four-Year High',
    slug: 'consumer-sentiment-rebounds-four-year-high',
    excerpt:
      'The headline index rose 6.4 points as year-ahead inflation expectations fell to 2.6%, the closest households have come to the Fed’s target since 2021.',
    category: 'economy',
    author: 'sarah-chen',
    publishedAt: '2026-08-14T10:45:00Z',
    readingTime: 4,
    photo: 'photo-1504711434969-e33886168f5c',
    body: [
      {
        p: 'Consumer sentiment rose 6.4 points to its highest level in four years, with gains spread across income groups and political affiliations — an unusual pattern in a survey that has become sharply partisan since 2020. Year-ahead inflation expectations fell to 2.6% and the five-to-ten-year measure eased to 2.9%.',
      },
      { h2: 'Grocery prices did what interest rates could not' },
      {
        p: 'Sentiment has tracked the level of food and fuel prices far more closely than it has tracked the rate of change in the overall index. Households experience inflation as a price on a shelf, not as a twelve-month percentage. With food-at-home prices roughly flat for three quarters and gasoline below $3 a gallon in most of the country, the everyday evidence has finally caught up with the official disinflation.',
      },
      {
        p: 'Expectations for personal finances over the coming year rose the most, while assessments of current buying conditions for durable goods improved on the back of lower financing costs and heavy dealer incentives.',
      },
      {
        quote:
          'People do not compute year-over-year rates. They remember what a cart of groceries cost, and that number stopped moving.',
      },
      { h2: 'The link to spending is weaker than it looks' },
      {
        p: 'Sentiment has been a poor predictor of consumption for the past four years — households reported gloom while spending steadily. Analysts therefore treat the rebound as confirmation of an existing trend rather than a signal of acceleration. The more actionable detail is the fall in inflation expectations, which policymakers watch closely because expectations that stay anchored make the last mile of disinflation considerably cheaper.',
      },
    ],
  },
  {
    n: 18,
    title: 'Existing Home Sales Climb as the 30-Year Mortgage Nears 5.5%',
    slug: 'existing-home-sales-climb-30-year-mortgage-nears-5-5',
    excerpt:
      'Resale volume rose for a fifth straight month and active listings reached their highest level since 2019, easing the inventory squeeze that defined the post-pandemic market.',
    category: 'economy',
    author: 'jennifer-walsh',
    publishedAt: '2026-08-10T11:20:00Z',
    readingTime: 6,
    photo: 'photo-1586023492125-27b2c045efd7',
    body: [
      {
        p: 'Existing home sales rose 3.1% on the month to a seasonally adjusted annual rate of 4.62 million, a fifth consecutive increase. The average 30-year fixed mortgage rate fell to 5.54%, down more than 180 basis points from its cycle peak, and active listings reached their highest level since 2019.',
      },
      { h2: 'The lock-in effect is dissolving' },
      {
        p: 'For three years the binding constraint on resale volume was not demand but supply: homeowners holding sub-3% mortgages had a powerful financial reason not to move. That gap has narrowed enough to change behaviour. The share of outstanding mortgages with a rate more than two percentage points below the prevailing rate has fallen from 71% at the peak to 44%.',
      },
      {
        p: 'Life events are winning again. Relocations, upsizing after a second child and downsizing in retirement are decisions that get deferred for a year or two, not indefinitely, and the backlog is now clearing.',
      },
      {
        quote:
          'Nobody sells a house because rates fell 50 basis points. They sell because they were always going to sell and the penalty for doing it finally got small enough to ignore.',
      },
      { h2: 'Prices are flattening, not falling' },
      {
        p: 'The national median sale price rose 1.8% year over year, the slowest appreciation since 2012 excluding the brief 2023 dip. Regional dispersion is wide: markets across Florida and Texas that saw heavy pandemic-era construction are posting outright declines, while the Northeast and Midwest continue to see low-single-digit gains against persistently thin supply.',
      },
      {
        p: 'First-time buyers have benefited most. Their share of purchases has recovered to 34% from a low of 24%, helped by lower rates, softer prices in high-supply metros and a wave of state-level down payment assistance programmes.',
      },
    ],
  },
  {
    n: 19,
    title: 'Student Loan Repayment Restart Shows Up in Discretionary Spending',
    slug: 'student-loan-repayment-restart-discretionary-spending',
    excerpt:
      'Card data shows households resuming payments cut restaurant and travel outlays by roughly 4%, with the effect concentrated among borrowers under 35.',
    category: 'economy',
    author: 'jennifer-walsh',
    publishedAt: '2026-08-05T10:30:00Z',
    readingTime: 5,
    photo: 'photo-1484480974693-6ca0a78fb36b',
    body: [
      {
        p: 'Anonymised card transaction data covering roughly 12 million US households shows that borrowers who resumed federal student loan payments this year reduced discretionary spending by an average of 4.1% relative to a matched control group. The reduction is concentrated in restaurants, travel and apparel.',
      },
      { h2: 'A small aggregate number with a narrow incidence' },
      {
        p: 'Federal student loan payments total roughly $85 billion annually, under 0.4% of consumer spending. In aggregate that is close to a rounding error. But the burden falls on about 26 million households, and for borrowers under 35 the median payment consumes 6% of take-home pay — enough to change monthly behaviour in visible ways.',
      },
      {
        p: 'The offsetting adjustments are also visible. Savings rates among affected households fell by about half a percentage point, and revolving credit balances rose faster than in the control group, suggesting some of the payment is being financed rather than absorbed.',
      },
      {
        quote:
          'It is not a macro story and it is a very real household story. Both things are true, and only one of them shows up in GDP.',
      },
      { h2: 'Which categories absorbed the hit' },
      {
        ul: [
          'Full-service restaurant spending fell 6.2%, the largest single category decline, with quick-service partially offsetting.',
          'Discretionary travel bookings fell 5.4%, driven by fewer trips rather than cheaper ones.',
          'Grocery and pharmacy spending was unchanged, consistent with substitution away from wants rather than needs.',
        ],
      },
      {
        p: 'Retailers with a young, credit-sensitive customer base have flagged the effect in earnings calls, and several have shifted promotional calendars toward the middle of the month, when borrowers report the most available cash.',
      },
    ],
  },
  {
    n: 20,
    title: 'Regional Fed Surveys Point to Manufacturing Stabilisation',
    slug: 'regional-fed-surveys-manufacturing-stabilisation',
    excerpt:
      'Four of five district factory indexes turned positive, with new orders improving and capital spending plans at their strongest since 2022.',
    category: 'economy',
    author: 'sarah-chen',
    publishedAt: '2026-07-31T11:35:00Z',
    readingTime: 5,
    photo: 'photo-1473341304170-971dccb5ac1e',
    body: [
      {
        p: 'Four of the five regional Federal Reserve manufacturing surveys moved into expansion territory this month, the first time that has happened since 2022. The improvement is broad: new orders, shipments and employment sub-indexes all rose, and capital expenditure intentions reached their highest reading of the cycle.',
      },
      { h2: 'Electrical equipment leads' },
      {
        p: 'The strength is concentrated in categories tied to grid and data centre construction — transformers, switchgear, cabling and industrial cooling. Lead times for large power transformers remain measured in years, and domestic producers are running near capacity while adding shifts.',
      },
      {
        p: 'Consumer-facing durable goods manufacturers report a more mixed picture. Appliance and furniture producers describe demand as improving with housing turnover but still well below 2021 volumes.',
      },
      {
        quote:
          'Every megawatt of new load needs a transformer, and we are not producing enough of them anywhere in the world. That is a multi-year order book, not a cycle.',
      },
      { h2: 'The labour constraint' },
      {
        p: 'Respondents identified skilled trades availability, not demand, as their primary limit on output. Wage growth in manufacturing has run above the private-sector average for four consecutive quarters, and firms report lengthening time-to-fill for electricians, welders and controls technicians.',
      },
      {
        p: 'That constraint is showing up in automation investment. Orders for industrial robots and machine vision systems have risen sharply, which economists read as a productivity story in the making — and a reason to expect manufacturing output growth to outpace manufacturing employment growth for some years.',
      },
    ],
  },
  {
    n: 21,
    title: 'Slower Immigration Tightens Labour Supply in Service Industries',
    slug: 'slower-immigration-tightens-labour-supply-services',
    excerpt:
      'Net migration fell to roughly 620,000 last year, and industries that had relied on it for headcount growth are reporting persistent vacancies and faster wage gains.',
    category: 'economy',
    author: 'marcus-ellison',
    publishedAt: '2026-07-27T12:00:00Z',
    readingTime: 6,
    photo: 'photo-1573496359142-b8d87734a5a2',
    body: [
      {
        p: 'Net international migration to the United States fell to an estimated 620,000 last year, down from a peak above 2.5 million in 2023. Because immigrants had accounted for the majority of labour force growth over that period, the slowdown is now the dominant factor in how fast total employment can grow.',
      },
      { h2: 'The arithmetic of a shrinking labour pool' },
      {
        p: 'With the native-born working-age population roughly flat, the economy’s break-even payroll growth — the pace consistent with a stable unemployment rate — has fallen to somewhere between 60,000 and 90,000 jobs per month, down from around 175,000 two years ago. That reframes recent employment reports considerably: 165,000 jobs is no longer a middling number.',
      },
      {
        p: 'The effect is unevenly distributed. Construction, food service, agriculture, long-term care and hospitality had the highest reliance on recent arrivals, and each is reporting vacancy rates well above the private-sector average alongside faster wage growth.',
      },
      {
        quote:
          'Break-even payroll growth is now roughly a third of what it was two years ago. Anyone comparing this year’s job reports to 2023 without adjusting for that is reading the wrong scale.',
      },
      { h2: 'Policy implications cut both ways' },
      {
        p: 'For the Federal Reserve, slower labour force growth means a given rate of hiring is more inflationary than it used to be — potentially arguing for caution on further cuts. For fiscal forecasters, it lowers projected GDP growth and worsens the dependency ratio underlying long-run entitlement costs.',
      },
      {
        p: 'Employers are responding with the tools available to them: higher starting wages, expanded hours for part-time staff, retention bonuses and, where feasible, automation. Several large restaurant and hotel operators have accelerated deployment of self-service technology, citing staffing rather than cost as the driver.',
      },
    ],
  },
  {
    n: 22,
    title: 'State Budget Surpluses Shrink as Sales Tax Growth Slows',
    slug: 'state-budget-surpluses-shrink-sales-tax-growth-slows',
    excerpt:
      'After three years of windfalls, more than half of US states are projecting flat or negative general fund growth for the coming fiscal year.',
    category: 'economy',
    author: 'marcus-ellison',
    publishedAt: '2026-07-22T11:50:00Z',
    readingTime: 5,
    photo: 'photo-1505664194779-8beaceb93744',
    body: [
      {
        p: 'Twenty-eight states now project flat or declining general fund revenue for the coming fiscal year, according to legislative fiscal office forecasts compiled by Coinscribed. It is a marked reversal from the 2021–2023 period, when federal transfers and unusually strong consumption produced record surpluses in nearly every state.',
      },
      { h2: 'Three forces converging' },
      {
        p: 'The first is the exhaustion of pandemic-era federal aid, which had substituted for state spending on health, education and infrastructure. The second is the maturing of tax cuts enacted when surpluses looked permanent — more than thirty states reduced income or sales tax rates between 2021 and 2024, and those reductions are now fully phased in. The third is slower nominal consumption growth, which mechanically slows sales tax receipts.',
      },
      {
        p: 'States that relied most heavily on capital gains realisations for income tax revenue face the widest swings. Their receipts move with equity markets, which makes multi-year budgeting hazardous.',
      },
      {
        quote:
          'Surpluses got treated as a new baseline and converted into permanent rate reductions. The receipts were cyclical; the tax cuts were not.',
      },
      { h2: 'Rainy day funds are the shock absorber' },
      {
        p: 'The good news is that reserves are unusually healthy. Aggregate state rainy day balances stand near 13% of annual general fund spending, roughly double the pre-pandemic norm, which gives legislatures room to absorb a soft year without immediate service cuts.',
      },
      {
        p: 'Municipal bond investors have been discriminating. Spreads on general obligation debt from states with thin reserves and heavy capital gains dependence have widened modestly, while the broad index remains near its tightest levels of the past decade.',
      },
    ],
  },

  // ----------------------------------------------------------- markets (11)
  {
    n: 23,
    title: 'S&P 500 Closes Above 6,600 as Market Breadth Widens',
    slug: 'sp500-closes-above-6600-market-breadth-widens',
    excerpt:
      'The index reached a record close with more than 70% of constituents above their 200-day average, the broadest participation of the current advance.',
    category: 'markets',
    author: 'david-park',
    publishedAt: '2026-08-31T18:20:00Z',
    readingTime: 5,
    photo: 'photo-1611974789855-9c2a0a7236a3',
    body: [
      {
        p: 'The S&P 500 closed at a record 6,614 on Monday, up 0.7%, with the equal-weighted version of the index outperforming the headline benchmark for a sixth consecutive week. More than 70% of constituents now trade above their 200-day moving average, the widest participation since the rally began.',
      },
      { h2: 'The concentration trade is unwinding gently' },
      {
        p: 'For three years, index returns were dominated by a handful of mega-cap technology names. That has changed without a drawdown in the leaders — an outcome few strategists thought likely. The largest ten holdings are up modestly year to date while industrials, financials and healthcare have contributed a growing share of the index advance.',
      },
      {
        p: 'Broadening is generally read as a sign of durability. Narrow markets are vulnerable because a small number of disappointments can reverse the whole index; broad markets require a genuine deterioration in the earnings outlook to break.',
      },
      {
        quote:
          'A rally that only works if seven companies keep beating expectations is a bet. A rally where three hundred companies participate is a cycle.',
      },
      { h2: 'Valuation is the constraint' },
      {
        p: 'The index trades at roughly 21.5 times forward earnings, above its ten-year average of 18.4. With consensus expecting 11% earnings growth next year, the arithmetic requires that growth to arrive largely as forecast — multiple expansion is unlikely to contribute much from here.',
      },
      {
        p: 'Positioning offers some cushion. Money market fund balances remain near record levels, and institutional equity allocations sit close to neutral rather than stretched. That leaves room for inflows if the earnings picture holds.',
      },
    ],
  },
  {
    n: 24,
    title: 'Semiconductor Index Jumps After Blowout Data Centre Guidance',
    slug: 'semiconductor-index-jumps-data-centre-guidance',
    excerpt:
      'Chip stocks added 4.6% in a session as the sector’s largest supplier guided next-quarter revenue $3 billion above consensus on accelerator demand.',
    category: 'markets',
    author: 'david-park',
    publishedAt: '2026-08-28T20:00:00Z',
    readingTime: 6,
    photo: 'photo-1551288049-bebda4e38f71',
    body: [
      {
        p: 'The Philadelphia Semiconductor Index rose 4.6% on Thursday, its largest single-day gain in nine months, after the sector’s dominant accelerator supplier guided next-quarter revenue roughly $3 billion above consensus and disclosed that supply remains committed through the following fiscal year.',
      },
      { h2: 'Backlog quality is the new metric' },
      {
        p: 'Investors have shifted their attention from quarterly beats to the composition of the order book. Purchase commitments from a small group of hyperscale buyers now dominate, and those buyers are simultaneously the sector’s largest customers and the developers of competing in-house silicon — a dependency that cuts in both directions.',
      },
      {
        p: 'Management addressed the concentration directly, noting that sovereign and enterprise orders have grown to roughly a fifth of the backlog. Analysts treated the disclosure as the most important item in the release, because it speaks to whether demand diversifies before the current capital cycle matures.',
      },
      {
        quote:
          'The question is no longer whether they can sell everything they make. It is who is still buying in 2028, and at what margin.',
      },
      { h2: 'The power bottleneck is now priced' },
      {
        p: 'Equipment makers, electrical component suppliers and industrial cooling firms all rallied alongside the chipmakers. The market has internalised the constraint: accelerator supply is no longer the limiting factor for data centre buildout — interconnection queues, transformer lead times and cooling capacity are.',
      },
      {
        p: 'That has produced an unusual dispersion within technology. Companies selling into the physical layer of AI infrastructure trade at premium multiples, while software firms expected to monetise the resulting capacity have lagged, reflecting scepticism about how quickly application revenue will follow the capital expenditure.',
      },
    ],
  },
  {
    n: 25,
    title: 'Ten-Year Treasury Yield Slips Below 3.9% on Duration Demand',
    slug: 'ten-year-treasury-yield-slips-below-3-9-percent',
    excerpt:
      'Pension funds and insurers extended duration into the latest auction, which cleared through the pre-sale level with the strongest bid-to-cover in two years.',
    category: 'markets',
    author: 'david-park',
    publishedAt: '2026-08-25T19:35:00Z',
    readingTime: 5,
    photo: 'photo-1521737711867-e3b97375f902',
    body: [
      {
        p: 'The ten-year Treasury yield fell to 3.87%, its lowest since 2024, after a $42 billion auction cleared 1.4 basis points through the pre-sale level with a bid-to-cover ratio of 2.71 — the strongest in two years. Indirect bidders, the category that captures most foreign and institutional demand, took 78% of the issue.',
      },
      { h2: 'Liability-driven buyers are back' },
      {
        p: 'Corporate defined-benefit plans are, on average, meaningfully overfunded for the first time in two decades, a consequence of strong equity returns and the higher discount rates of the past three years. The rational response to being overfunded is to lock the win by extending duration, which creates persistent, price-insensitive demand for long Treasuries.',
      },
      {
        p: 'Insurers have been buying for related reasons. Annuity sales have run at record levels, and the assets backing those liabilities have to go somewhere with a matching maturity profile.',
      },
      {
        quote:
          'This is not a macro trade. A plan that is 108% funded does not care about the level of yields, it cares about never being 85% funded again.',
      },
      { h2: 'The supply overhang has not disappeared' },
      {
        p: 'Treasury still needs to finance deficits near 6% of GDP, and the recent budget agreement did little to alter the medium-term path. Dealers expect coupon auction sizes to keep rising through next year, which caps how far long yields can fall on demand alone.',
      },
      {
        p: 'The curve has responded by steepening modestly at the very long end, with the thirty-year holding a wider spread over the ten-year than at any point in the past decade — the market’s way of charging a term premium for fiscal risk without repricing the front end.',
      },
    ],
  },
  {
    n: 26,
    title: 'Gold Sets a Fresh Record Near $3,900 on Central Bank Buying',
    slug: 'gold-sets-fresh-record-near-3900-central-bank-buying',
    excerpt:
      'Official sector purchases exceeded 1,100 tonnes over the past year, and Western ETF holdings have finally begun to rebuild after three years of outflows.',
    category: 'markets',
    author: 'priya-raman',
    publishedAt: '2026-08-21T17:55:00Z',
    readingTime: 6,
    photo: 'photo-1561070791-2526d30994b5',
    body: [
      {
        p: 'Gold reached a record $3,884 an ounce this week, extending a run that has now delivered four consecutive annual gains. Central bank purchases have been the dominant force, exceeding 1,100 tonnes over the trailing twelve months — roughly a quarter of annual mine supply.',
      },
      { h2: 'Reserve diversification, not inflation hedging' },
      {
        p: 'The traditional framing of gold as an inflation hedge has performed poorly as an explanation. Prices rose through the disinflation of the past two years and continued rising as real yields stayed positive. The better explanation is balance sheet composition: official institutions holding large dollar reserves have been reducing concentration, and gold is the only reserve asset with no issuer and no counterparty.',
      },
      {
        p: 'That demand is notably price-insensitive. Reserve managers buy on a schedule against an allocation target, which puts a persistent bid under the market that is unrelated to the tactical positioning of futures traders.',
      },
      {
        quote:
          'A reserve manager is not trying to make money on gold. They are trying to hold something that cannot be frozen, and there is exactly one asset in that category.',
      },
      { h2: 'Western investors are returning late' },
      {
        p: 'Physically backed gold ETFs have added holdings for seven consecutive months after three years of steady redemptions. Retail and advisory demand typically arrives after a trend is established, and the pattern is repeating.',
      },
      {
        p: 'Miners have been the leveraged expression. The largest producers are generating free cash flow margins above 30% at current prices while holding capital discipline — a marked contrast to the 2011 cycle, when record prices funded value-destroying acquisitions. Dividend and buyback commitments have risen accordingly.',
      },
    ],
  },
  {
    n: 27,
    title: 'Tesla Deliveries Beat Estimates and Shares Rally 11%',
    slug: 'tesla-deliveries-beat-estimates-shares-rally-11',
    excerpt:
      'Quarterly deliveries of 612,000 vehicles topped consensus by 8%, with the lower-priced model accounting for nearly a third of the total.',
    category: 'markets',
    author: 'david-park',
    publishedAt: '2026-08-17T20:15:00Z',
    readingTime: 4,
    photo: 'photo-1617788138017-80ad40651399',
    body: [
      {
        p: 'Tesla shares rose 11.2% after the company reported quarterly deliveries of 612,000 vehicles, about 8% above consensus. The lower-priced model launched last year accounted for 189,000 units, roughly a third of the total, confirming that the volume strategy is working on the top line.',
      },
      { h2: 'Volume at what margin' },
      {
        p: 'The delivery beat leaves the central question unanswered until the full financial release. A cheaper vehicle mix mechanically compresses average selling prices, and the market’s reaction implicitly assumes that manufacturing cost reductions have kept pace. Automotive gross margin excluding regulatory credits has ranged between 15% and 18% over the past four quarters, well below the 2022 peak.',
      },
      {
        p: 'Energy storage remains the quiet outperformer. Deployments have grown at a triple-digit annual rate for three years, carry higher margins than the automotive business, and are sold into a utility procurement market with multi-year contracts.',
      },
      {
        quote:
          'The energy business would be a highly valued standalone company. Inside this reporting structure, most investors still treat it as a footnote.',
      },
      { h2: 'Competitive backdrop' },
      {
        p: 'US market share has stabilised near 42% after three years of decline, helped by the new model and by several competitors scaling back electric vehicle programmes. In Europe, share has continued to erode against domestic manufacturers with strong dealer networks and locally produced compact models.',
      },
    ],
  },
  {
    n: 28,
    title: 'Small Caps Break Out as the Russell 2000 Hits a Three-Year High',
    slug: 'small-caps-break-out-russell-2000-three-year-high',
    excerpt:
      'Lower funding costs and a wave of refinancing have lifted the small-cap benchmark 19% from its spring low, closing part of a historic valuation gap.',
    category: 'markets',
    author: 'david-park',
    publishedAt: '2026-08-13T18:05:00Z',
    readingTime: 5,
    photo: 'photo-1542751371-adc38448a05e',
    body: [
      {
        p: 'The Russell 2000 closed at a three-year high, up 19% from its spring low and outperforming large caps by nine percentage points over that stretch. The driver is arithmetic rather than sentiment: small companies carry more floating-rate debt and shorter maturities than large ones, so falling funding costs flow directly into earnings.',
      },
      { h2: 'The refinancing wall became a refinancing window' },
      {
        p: 'A heavy schedule of small-cap maturities in 2026 and 2027 was widely expected to force distressed refinancing at punitive rates. Instead, lower base rates and tight credit spreads have let the majority of issuers refinance at costs close to what they were replacing. Interest coverage ratios across the index have improved for three consecutive quarters.',
      },
      {
        p: 'Profitability has also improved through composition. The share of index constituents with negative trailing earnings has fallen from 42% to 33%, partly through recovery and partly through the removal of persistent loss-makers.',
      },
      {
        quote:
          'Small caps were never a bet on the economy. They were a bet on the cost of money, and that bet finally paid.',
      },
      { h2: 'Valuation still favours the asset class' },
      {
        p: 'The small-cap index trades near 15.5 times forward earnings against 21.5 for large caps. That discount is wider than at any point outside the 2000 and 2020 dislocations, and mean reversion in the relationship has historically been a reliable if slow-moving force.',
      },
      {
        p: 'Merger and acquisition activity has picked up in response. Private equity firms sitting on record dry powder have found public small caps cheaper than comparable private assets, and announced take-private volume in the segment is running at its highest level since 2021.',
      },
    ],
  },
  {
    n: 29,
    title: 'Oil Slides Under $60 After an OPEC+ Supply Surprise',
    slug: 'oil-slides-under-60-opec-supply-surprise',
    excerpt:
      'Brent fell 6% in two sessions as the producer group unwound voluntary cuts faster than expected, adding 1.1 million barrels a day to a market already well supplied.',
    category: 'markets',
    author: 'priya-raman',
    publishedAt: '2026-08-08T19:00:00Z',
    readingTime: 6,
    photo: 'photo-1726731782158-fcf6822b6ca4',
    body: [
      {
        p: 'Brent crude fell below $60 a barrel for the first time in three years after OPEC+ agreed to unwind voluntary production cuts on an accelerated schedule, returning roughly 1.1 million barrels a day to the market over the next two quarters. West Texas Intermediate settled at $56.40.',
      },
      { h2: 'Defending price versus defending share' },
      {
        p: 'The group has spent two years supporting prices by withholding supply, and in doing so ceded market share to non-member producers — principally the United States, Brazil, Guyana and Canada. Every barrel withheld made a marginal non-OPEC project economic. The decision reflects a judgement that the strategy had reached the limits of its usefulness.',
      },
      {
        p: 'Compliance was also fraying. Several members had been producing above quota for months, which made the official ceiling increasingly notional and created internal pressure to formalise what was already happening.',
      },
      {
        quote:
          'You can defend price or you can defend share. Two years of defending price funded a great deal of competing supply, and that bill eventually arrives.',
      },
      { h2: 'Who feels it first' },
      {
        p: 'US shale operators have guided to maintenance-level capital spending at $60 Brent, prioritising free cash flow and shareholder returns over growth. The tier of independent producers with higher break-evens in the Permian fringe and Bakken is where activity reductions are appearing, with the domestic rig count already down 8% from its spring peak.',
      },
      {
        p: 'For consumers and central bankers, cheaper crude is straightforwardly helpful. Retail gasoline is heading toward $2.70 a gallon nationally, which supports household real income and pulls the energy component of headline inflation lower — reinforcing the disinflation trend without any policy action.',
      },
    ],
  },
  {
    n: 30,
    title: 'IPO Window Reopens With Three Billion-Dollar Listings',
    slug: 'ipo-window-reopens-three-billion-dollar-listings',
    excerpt:
      'Two enterprise software companies and a payments processor priced above their ranges, and all three held their gains through the first week of trading.',
    category: 'markets',
    author: 'emily-rodriguez',
    publishedAt: '2026-08-04T17:20:00Z',
    readingTime: 5,
    photo: 'photo-1460925895917-afdab827c52f',
    body: [
      {
        p: 'Three companies raised more than $1 billion each in US initial public offerings this month, and all three closed their first week above the offer price. Combined proceeds from US listings this year have already exceeded the previous two years put together.',
      },
      { h2: 'What the successful deals had in common' },
      {
        p: 'Every one of the three arrived with positive operating cash flow, revenue growth above 25% and a demonstrated path to margin expansion. That profile is very different from the 2021 cohort, where growth at any cost was rewarded and profitability was treated as a later problem.',
      },
      {
        p: 'Deal construction has changed too. Float sizes are larger, giving institutions the position sizes they need without dominating the aftermarket. Cornerstone investors with long lock-ups anchored each book, and pricing was deliberately conservative relative to indicated demand.',
      },
      {
        quote:
          'Nobody prices for the last dollar any more. A deal that trades up for three months is worth far more to the sponsor than one that squeezes an extra two dollars on day one.',
      },
      { h2: 'The backlog is unusually large' },
      {
        p: 'Private equity and venture portfolios hold an extraordinary volume of mature, unsold assets — companies well past the age at which they would historically have listed. Sponsors need exits, and secondary sales and continuation vehicles have absorbed only part of the pressure.',
      },
      {
        p: 'Bankers report the strongest pipeline since 2021, weighted toward enterprise software, healthcare services and financial technology. The constraint is no longer investor appetite but the availability of audited multi-year financials that meet current disclosure expectations.',
      },
    ],
  },
  {
    n: 31,
    title: 'Dollar Index Falls to a Fourteen-Month Low as Rate Gaps Narrow',
    slug: 'dollar-index-falls-fourteen-month-low-rate-gaps',
    excerpt:
      'The greenback weakened 7% from its January peak as other central banks held policy steady while the Fed eased, lifting unhedged foreign returns for US investors.',
    category: 'markets',
    author: 'sarah-chen',
    publishedAt: '2026-07-30T18:40:00Z',
    readingTime: 5,
    photo: 'photo-1642790106117-e829e14a795f',
    body: [
      {
        p: 'The dollar index fell to a fourteen-month low, down about 7% from its January peak. The move reflects a straightforward narrowing of interest rate differentials: the Federal Reserve has cut twice this year while the European Central Bank and the Bank of Japan have held, compressing the yield advantage that supported the currency through 2024 and 2025.',
      },
      { h2: 'Second-order effects for US investors' },
      {
        p: 'A weaker dollar mechanically raises the dollar value of unhedged foreign assets. International developed-market equity indexes are up in the high teens in dollar terms this year against high single digits in local currency — the entire difference is currency translation.',
      },
      {
        p: 'For US corporates, the effect flows through translated overseas earnings. Roughly 40% of S&P 500 revenue is generated outside the United States, so a sustained decline provides a modest tailwind to reported results, concentrated in technology, industrials and consumer staples.',
      },
      {
        quote:
          'Half the case for international diversification over the past decade was undone by the dollar. When that reverses, the allocation starts looking clever again without anyone changing their model.',
      },
      { h2: 'How far this can run' },
      {
        p: 'Purchasing power parity measures had shown the dollar meaningfully overvalued against most major currencies at the start of the year, and the decline has closed only part of that gap. Longer-run flow considerations — the current account deficit and the scale of foreign holdings of US assets — argue for further weakness, though such measures have been poor short-horizon predictors.',
      },
      {
        p: 'Emerging market assets have been the clearest beneficiaries. Local currency debt has posted its best year since 2017, helped by the currency move and by central banks in the region having room to cut without defending their exchange rates.',
      },
    ],
  },
  {
    n: 32,
    title: 'Corporate Bond Spreads Reach Their Tightest Level Since 2021',
    slug: 'corporate-bond-spreads-tightest-level-since-2021',
    excerpt:
      'Investment grade spreads compressed to 79 basis points as record issuance met even stronger demand from yield-focused institutional buyers.',
    category: 'markets',
    author: 'david-park',
    publishedAt: '2026-07-25T19:25:00Z',
    readingTime: 5,
    photo: 'photo-1559526324-4b87b5e36e44',
    body: [
      {
        p: 'Investment grade corporate bond spreads narrowed to 79 basis points over Treasuries, the tightest level since 2021 and roughly 40 basis points below the twenty-year average. High yield spreads have compressed to 268 basis points, also near cycle tights.',
      },
      { h2: 'Demand is arriving for the yield, not the spread' },
      {
        p: 'The distinction matters. Insurers, pension plans and retail bond funds are buying because all-in yields near 5% meet their return requirements — the spread component is almost incidental to that decision. As long as absolute yields remain attractive, demand persists even as compensation for credit risk shrinks.',
      },
      {
        p: 'Issuers have taken full advantage. Investment grade supply is running at a record annual pace, dominated by refinancing rather than new leverage. Aggregate net debt to EBITDA across the index has been broadly stable for two years.',
      },
      {
        quote:
          'Buyers are being paid very little for taking credit risk, and they are taking it anyway because the alternative pays less. That is how cycles end, but it can persist for a long time first.',
      },
      { h2: 'Where the risk has migrated' },
      {
        p: 'The weakest borrowers have largely moved to private credit, which now holds an estimated $1.9 trillion in assets. That has flattered the quality of the public high yield index — the CCC-rated share has fallen to a two-decade low — while shifting the same exposure into vehicles with less price transparency and less frequent marking.',
      },
      {
        p: 'Regulators have begun requesting more granular disclosure of valuation methodology and payment-in-kind interest from private credit managers, on the view that the sector’s growth has outpaced the reporting framework around it.',
      },
    ],
  },
  {
    n: 33,
    title: 'EV Charging Buildout Draws Record Infrastructure Capital',
    slug: 'ev-charging-buildout-draws-record-infrastructure-capital',
    excerpt:
      'Infrastructure funds committed $14 billion to US charging networks this year, betting on utilisation rather than on subsidies.',
    category: 'markets',
    author: 'priya-raman',
    publishedAt: '2026-07-21T18:30:00Z',
    readingTime: 5,
    photo: 'photo-1593941707882-a5bba14938c7',
    body: [
      {
        p: 'Infrastructure funds have committed roughly $14 billion to US electric vehicle charging assets this year, a record, and the composition of the capital has changed. Early investment came from venture funds underwriting growth; the current wave comes from infrastructure managers underwriting contracted cash flows and utilisation.',
      },
      { h2: 'Utilisation finally cleared the hurdle' },
      {
        p: 'Fast charging is a fixed-cost business. A site requires grid interconnection, hardware and civil works largely regardless of how many vehicles use it, so returns are almost entirely a function of throughput. For years, average utilisation across US networks sat in the single digits — well below the roughly 15% that supports an infrastructure return.',
      },
      {
        p: 'With the electric share of new vehicle sales now above 20% in most large metropolitan areas, well-sited corridor locations are clearing 20% to 25% utilisation. That is the threshold at which the asset class becomes financeable with conventional infrastructure debt.',
      },
      {
        quote:
          'Charging stopped being a technology investment the moment utilisation became predictable. It is a toll road with a shorter concession.',
      },
      { h2: 'Consolidation is under way' },
      {
        p: 'Three of the ten largest US networks have been acquired in the past year, generally by utility affiliates or infrastructure funds able to fund at a lower cost of capital than the original venture backers. Site quality, not station count, has been the determinant of price.',
      },
      {
        p: 'The remaining constraint is the same one facing data centres: interconnection. Queue times for new high-capacity connections run two to four years in several regions, which has pushed operators toward on-site battery storage to reduce the grid capacity they need to request.',
      },
    ],
  },

  // ----------------------------------------------------------- banking (11)
  {
    n: 34,
    title: 'OCC Finalises Open Banking Data-Sharing Rule',
    slug: 'occ-finalises-open-banking-data-sharing-rule',
    excerpt:
      'Banks must provide consumers and authorised third parties with standardised API access to account data by mid-2027, with fee caps and revocable consent.',
    category: 'banking',
    author: 'robert-feldman',
    publishedAt: '2026-08-31T12:05:00Z',
    readingTime: 6,
    photo: 'photo-1571974448718-ac26a9af7d8b',
    body: [
      {
        p: 'Federal regulators finalised the long-awaited open banking rule on Friday, requiring depository institutions to make consumer account data available through standardised application programming interfaces by mid-2027. The rule caps the fees banks may charge data recipients and requires that consumer consent be granular, time-limited and revocable in one step.',
      },
      { h2: 'Screen scraping is on a deadline' },
      {
        p: 'For fifteen years, most account aggregation in the United States worked by having a third party log in with the customer’s credentials and read the page. It functioned, but it required consumers to hand over passwords, broke whenever a bank changed its interface, and gave the recipient access to everything rather than to the specific data needed.',
      },
      {
        p: 'The rule phases out credential-based access in favour of tokenised API connections with defined scopes. A budgeting application can request transaction history without also gaining the ability to initiate transfers.',
      },
      {
        quote:
          'We are ending the era where the only way to share your own banking data was to give someone your password and hope.',
      },
      { h2: 'Fee caps were the fight' },
      {
        p: 'Large banks argued that building and maintaining API infrastructure is expensive and that recipients should bear a share of the cost. Fintech firms countered that unrestricted pricing would let incumbents set fees high enough to foreclose competition. The final rule permits recovery of reasonable direct costs with a published schedule, and requires that pricing not discriminate between affiliated and unaffiliated recipients.',
      },
      {
        p: 'Implementation timelines are tiered by asset size. Institutions above $50 billion must comply first, with community banks receiving an additional eighteen months and the option to comply through a shared core provider — an accommodation the community banking trade groups had pressed for throughout the comment period.',
      },
    ],
  },
  {
    n: 35,
    title: 'Instant Payment Volume Tops $1.2 Trillion as Rails Reach Scale',
    slug: 'instant-payment-volume-tops-1-2-trillion',
    excerpt:
      'Real-time transfers between US bank accounts grew 34% year over year, with payroll and insurance disbursements driving the increase.',
    category: 'banking',
    author: 'danielle-whitfield',
    publishedAt: '2026-08-28T09:20:00Z',
    readingTime: 5,
    photo: 'photo-1556745757-8d76bdb6984b',
    body: [
      {
        p: 'US instant payment volume reached $1.2 trillion over the past twelve months, up 34% year over year. The growth is no longer coming from person-to-person transfers, which have plateaued, but from business disbursements: payroll, insurance claims, gig economy payouts and loan proceeds.',
      },
      { h2: 'Businesses discovered the use case' },
      {
        p: 'The economics favour instant settlement in specific situations. An insurer paying a claim in seconds rather than five days measurably improves customer retention. A staffing firm offering same-day pay fills shifts that would otherwise go unfilled. In both cases the operational benefit exceeds the per-transaction cost by a wide margin.',
      },
      {
        p: 'Irrevocability is the constraint. Once an instant payment settles, it cannot be pulled back, which makes it unsuitable for transactions where the payer may want recourse. That keeps card networks firmly in place for retail purchases and pushes instant rails toward payouts, where the payer is confident in the obligation.',
      },
      {
        quote:
          'Instant is not a better version of a card payment. It is a better version of a wire, and the wire market is enormous and badly served.',
      },
      { h2: 'Fraud follows the volume' },
      {
        p: 'Authorised push payment fraud — where a victim is deceived into sending a payment themselves — has grown faster than volume. Because the transaction is technically legitimate and irrevocable, traditional fraud controls do little. Institutions have responded with behavioural analytics, confirmation-of-payee checks and holding periods for first-time recipients.',
      },
      {
        p: 'Liability allocation remains unsettled. Several state legislatures have introduced bills that would shift more of the loss onto institutions, following the model adopted in the United Kingdom, and industry groups have argued for a shared-liability framework that includes the platforms where the scams originate.',
      },
    ],
  },
  {
    n: 36,
    title: 'Chase Rolls Out an AI Money Coach to 60 Million Customers',
    slug: 'chase-rolls-out-ai-money-coach-60-million-customers',
    excerpt:
      'The assistant is embedded in the mobile app at no additional cost, offering cash flow forecasts and savings prompts with escalation to human advisers.',
    category: 'banking',
    author: 'emily-rodriguez',
    publishedAt: '2026-08-25T08:50:00Z',
    readingTime: 6,
    photo: 'photo-1677442136019-21780ecad995',
    body: [
      {
        p: 'JPMorgan Chase began rolling out an AI-powered financial assistant to its full retail customer base this week, embedding it in the mobile app at no additional cost. The tool forecasts cash flow four weeks ahead, flags recurring charges the customer may have forgotten, and proposes automated transfers sized to what the forecast suggests is genuinely spare.',
      },
      { h2: 'Narrow by design' },
      {
        p: 'The assistant answers questions about the customer’s own accounts. It does not recommend securities, quote prices or discuss markets. That restriction is deliberate: keeping the system inside a defined domain both reduces regulatory exposure and makes the output far more reliable, because every claim can be grounded in transaction data the bank already holds.',
      },
      {
        p: 'Escalation is built in. When a conversation moves toward retirement planning, tax treatment or anything the bank classifies as advice, the interface offers to schedule a human adviser rather than attempting an answer.',
      },
      {
        quote:
          'The valuable version of this is not a chatbot that knows about markets. It is something that knows your rent clears on the third and your paycheque lands on the first.',
      },
      { h2: 'Measured results from the pilot' },
      {
        p: 'In a twelve-month pilot with 500,000 customers, the bank reported that engaged users increased savings balances by an average of 11%, incurred 23% fewer overdraft events, and were substantially more likely to enrol in automated transfers. Customers who interacted with the tool at least monthly showed higher retention than a matched control group.',
      },
      {
        p: 'Competitive pressure is immediate. Two other large national banks have announced comparable products, and core processing vendors are packaging similar functionality for community banks that cannot build in-house — which will determine whether the capability becomes a differentiator or simply the new baseline.',
      },
    ],
  },
  {
    n: 37,
    title: 'Regional Banks Post Their Strongest Margins Since 2023',
    slug: 'regional-banks-post-strongest-margins-since-2023',
    excerpt:
      'Falling deposit costs outpaced the decline in asset yields, lifting net interest margins across the mid-cap banking group for a third consecutive quarter.',
    category: 'banking',
    author: 'emily-rodriguez',
    publishedAt: '2026-08-20T09:10:00Z',
    readingTime: 5,
    photo: 'photo-1544717297-fa95b6ee9643',
    body: [
      {
        p: 'Net interest margins across the mid-cap US banking group expanded for a third consecutive quarter, reaching their highest level since early 2023. The mechanism is a favourable repricing lag: deposit costs are falling faster than loan and securities yields as promotional certificates mature and are replaced at lower rates.',
      },
      { h2: 'The deposit war is over' },
      {
        p: 'Through 2023 and 2024, regional banks competed aggressively for deposits, offering rates that at times exceeded what they earned on new lending. Those certificates are now rolling off. Cumulative deposit betas — the share of a rate change passed through to depositors — have run higher on the way down than most managements guided, which is unusually good news for margins.',
      },
      {
        p: 'Deposit composition has also improved. Non-interest-bearing balances, which collapsed as rates rose, have stabilised and begun to recover modestly as the opportunity cost of holding cash in a checking account declines.',
      },
      {
        quote:
          'We paid up for two years to keep balances that were never going anywhere. Getting to reprice those is most of the margin story, and it required no strategy at all.',
      },
      { h2: 'Credit is the swing factor' },
      {
        p: 'Commercial real estate remains the concentrated risk, particularly office exposure in central business districts. Charge-offs have been manageable but reserve builds continue, and several banks have accelerated dispositions of maturing office loans rather than extending them.',
      },
      {
        p: 'Consumer credit has performed better than feared. Card and auto delinquencies have eased for three consecutive quarters, and unemployment near 4% keeps the primary driver of consumer loss rates contained. Managements have generally guided to stable provisions rather than releases, reflecting caution about the durability of the trend.',
      },
    ],
  },
  {
    n: 38,
    title: 'FDIC Extends Deposit Insurance Clarity to Fintech Partnerships',
    slug: 'fdic-extends-deposit-insurance-clarity-fintech-partnerships',
    excerpt:
      'New recordkeeping rules require partner banks to identify every beneficial owner daily, closing the gap exposed by the collapse of a payments middleware provider.',
    category: 'banking',
    author: 'robert-feldman',
    publishedAt: '2026-08-17T08:35:00Z',
    readingTime: 6,
    photo: 'photo-1521791055366-0d553872125f',
    body: [
      {
        p: 'The FDIC finalised recordkeeping requirements for banks that hold deposits on behalf of fintech intermediaries. Institutions must maintain daily reconciled records identifying each beneficial owner and their balance, in a format the agency can act on immediately in a receivership. The rules take effect for new arrangements at once and for existing ones within twelve months.',
      },
      { h2: 'The failure that prompted it' },
      {
        p: 'When a middleware provider connecting fintech applications to partner banks collapsed, its ledger and the banks’ ledgers disagreed. Deposits were insured, but the FDIC could not determine who owned what, and hundreds of thousands of consumers lost access to funds for months. The money existed; the records did not.',
      },
      {
        p: 'The rule attacks that failure mode directly. Reconciliation must happen daily, the bank must hold its own copy rather than relying on the intermediary’s system, and disclosures to consumers must name the specific insured institution holding their deposit.',
      },
      {
        quote:
          'Insurance was never the problem. The problem was that nobody could produce a list of depositors, and insurance without a list is a promise you cannot execute.',
      },
      { h2: 'Consequences for the partnership model' },
      {
        ul: [
          'Compliance costs rise materially, which favours larger sponsor banks with dedicated infrastructure over the small institutions that dominated the model.',
          'Middleware providers must expose ledger data to sponsor banks continuously, reducing their ability to sit as an opaque layer between the parties.',
          'Consumer-facing disclosure becomes explicit, ending marketing that implied a fintech application was itself a bank.',
        ],
      },
      {
        p: 'Several sponsor banks have already exited the business, citing the economics of oversight relative to the deposit revenue. Consolidation among the remaining sponsors is expected to continue.',
      },
    ],
  },
  {
    n: 39,
    title: 'Credit Card Delinquencies Ease for a Third Straight Quarter',
    slug: 'credit-card-delinquencies-ease-third-straight-quarter',
    excerpt:
      'Ninety-day balances fell to 3.1% of outstandings as wage growth outpaced inflation and lenders kept underwriting standards tight.',
    category: 'banking',
    author: 'danielle-whitfield',
    publishedAt: '2026-08-12T09:55:00Z',
    readingTime: 5,
    photo: 'photo-1560472355-536de3962603',
    body: [
      {
        p: 'The share of US credit card balances 90 or more days delinquent fell to 3.1%, down from a 2024 peak of 4.2% and a third consecutive quarterly improvement. Auto loan delinquencies have followed a similar path, though subprime auto remains elevated relative to history.',
      },
      { h2: 'Real wage growth did the work' },
      {
        p: 'Delinquency is fundamentally a cash flow problem. Nominal wage growth has exceeded inflation for roughly two years, which has slowly rebuilt the margin between income and fixed obligations for households in the lower half of the income distribution — precisely the cohort that drove the earlier deterioration.',
      },
      {
        p: 'Underwriting discipline reinforced the trend. Issuers tightened approval criteria and reduced credit line increases through 2024, which meant fewer marginal borrowers were added at the peak of the stress. The vintages originated in that period are performing better than those from 2022.',
      },
      {
        quote:
          'The 2022 vintage was underwritten on stimulus-era cash flows that had already disappeared. Everything since has been underwritten on the world as it actually is.',
      },
      { h2: 'What still concerns lenders' },
      {
        p: 'Aggregate revolving balances remain near record levels in nominal terms, and the average interest rate on carried balances is above 21%. For borrowers who revolve consistently, the arithmetic remains punishing even as the delinquency rate falls.',
      },
      {
        p: 'Buy-now-pay-later obligations are the visibility gap. A growing share is now furnished to credit bureaus, but coverage is incomplete, and lenders acknowledge that reported debt-to-income ratios understate true obligations for younger borrowers who use these products heavily.',
      },
    ],
  },
  {
    n: 40,
    title: 'FedNow Reaches 1,400 Institutions but Volume Lags Enrolment',
    slug: 'fednow-reaches-1400-institutions-volume-lags',
    excerpt:
      'Most participating banks can receive instant payments; far fewer can send them, and that asymmetry is holding back network effects.',
    category: 'banking',
    author: 'danielle-whitfield',
    publishedAt: '2026-08-07T13:15:00Z',
    readingTime: 5,
    photo: 'photo-1551434678-e076c223a692',
    body: [
      {
        p: 'The Federal Reserve’s instant payment service now counts more than 1,400 participating financial institutions, roughly triple the figure two years ago. Transaction volume, however, remains a small fraction of the network’s theoretical capacity, and the reason is structural: about two thirds of participants have enabled receiving only.',
      },
      { h2: 'Receiving is easy, sending is a risk decision' },
      {
        p: 'Enabling receipt requires little more than a core processing update. Enabling send means accepting irrevocable, real-time outbound transfers, which requires real-time fraud screening, intraday liquidity management and the acceptance that a mistaken payment cannot be recalled. For a community bank, that is a materially harder decision.',
      },
      {
        p: 'Until send is widely enabled, the network cannot deliver the ubiquity that makes it useful. A business cannot standardise on a rail that reaches only a portion of its counterparties, so it keeps ACH as the default.',
      },
      {
        quote:
          'Every institution wants to receive instantly and settle outbound tomorrow. That is not a network, it is a wish list.',
      },
      { h2: 'What would change the trajectory' },
      {
        p: 'Core processing vendors are the practical gatekeepers. Most community banks cannot implement send functionality independently, and the largest core providers have only recently made it available as a standard rather than bespoke integration. As that ships, adoption should follow without any individual bank making a strategic decision.',
      },
      {
        p: 'Government disbursement is the other potential catalyst. Federal and state agencies moving tax refunds and benefit payments to instant rails would create the volume that justifies investment, and several state agencies have begun pilots.',
      },
    ],
  },
  {
    n: 41,
    title: 'Two Mid-Cap Banks Announce a $9 Billion Merger',
    slug: 'two-mid-cap-banks-announce-9-billion-merger',
    excerpt:
      'The all-stock deal creates a $190 billion institution and is being framed as a technology scale play rather than a cost-cutting exercise.',
    category: 'banking',
    author: 'emily-rodriguez',
    publishedAt: '2026-08-03T09:05:00Z',
    readingTime: 5,
    photo: 'photo-1521791136064-7986c2920216',
    body: [
      {
        p: 'Two mid-cap regional banks announced an all-stock merger valued at roughly $9 billion, creating an institution with about $190 billion in assets. Management guided to $420 million in annual cost synergies, with roughly 60% attributed to technology and operations rather than branch consolidation.',
      },
      { h2: 'Scale is now a technology argument' },
      {
        p: 'The strategic case rests on fixed costs that do not scale down. A modern digital banking platform, a real-time fraud engine, an AI customer assistant and a compliance function that satisfies current expectations cost roughly the same whether an institution has $90 billion or $190 billion in assets. Spreading that base over more revenue is the entire logic.',
      },
      {
        p: 'That reasoning has become common across the sector. The largest national banks spend more annually on technology than most regionals earn, and the gap in digital capability has become visible to customers in ways that branch density no longer is.',
      },
      {
        quote:
          'We are not merging to close branches. We are merging because we each need to build the same platform and neither of us can amortise it alone.',
      },
      { h2: 'The approval question' },
      {
        p: 'Bank merger review has been faster and more predictable over the past eighteen months than in the preceding period, and the parties guided to closing within nine months. Geographic overlap is limited, which removes the deposit concentration issues that complicate in-market deals.',
      },
      {
        p: 'Analysts expect the transaction to catalyse further activity. Several banks in the $50 billion to $150 billion range face the same fixed-cost arithmetic, and boards that have resisted consolidation are reportedly revisiting the maths.',
      },
    ],
  },
  {
    n: 42,
    title: 'Branch Closures Slow as Banks Rethink Their Physical Footprint',
    slug: 'branch-closures-slow-banks-rethink-physical-footprint',
    excerpt:
      'Net closures fell to their lowest level in eight years as institutions found that branches drive small business deposits and mortgage origination.',
    category: 'banking',
    author: 'danielle-whitfield',
    publishedAt: '2026-07-29T08:25:00Z',
    readingTime: 5,
    photo: 'photo-1580554430120-94cfcb3adf25',
    body: [
      {
        p: 'US banks closed a net 1,180 branches over the past year, the smallest reduction since 2018 and less than half the pace of the 2021 peak. Several large institutions have announced new openings in selected markets — the first meaningful expansion announcements in more than a decade.',
      },
      { h2: 'What the data revealed' },
      {
        p: 'Deposit attribution studies consistently show that closing a branch loses more balances than the branch itself held. Small business customers in particular concentrate their relationship where they can physically deposit cash and speak to a lender, and those relationships carry the low-cost operating deposits that fund the balance sheet.',
      },
      {
        p: 'Mortgage origination shows a similar pattern. Purchase applications — as distinct from refinancing — retain a strong local component, and loan officers with a physical presence in a market originate more volume at better pull-through rates.',
      },
      {
        quote:
          'We closed branches for a decade and measured the cost savings precisely and the deposit attrition loosely. When we finally measured both properly, the answer changed.',
      },
      { h2: 'The format has changed, not the presence' },
      {
        p: 'New branches are smaller, with fewer teller windows, more advisory space and extended self-service. The average new build is under 2,500 square feet against roughly 4,500 for the stock being replaced, and staffing skews toward licensed advisers rather than transaction processing.',
      },
      {
        p: 'Placement is more analytical. Institutions are targeting markets with growing small business formation and underserved competitive positions, rather than the traffic-count logic that drove the last expansion cycle.',
      },
    ],
  },
  {
    n: 43,
    title: 'Overdraft Revenue Falls 38% From Its Pre-Reform Peak',
    slug: 'overdraft-revenue-falls-38-percent-pre-reform-peak',
    excerpt:
      'Banks have replaced overdraft income with subscription accounts, small-dollar credit lines and interchange, keeping fee revenue roughly flat.',
    category: 'banking',
    author: 'danielle-whitfield',
    publishedAt: '2026-07-24T10:15:00Z',
    readingTime: 5,
    photo: 'photo-1556742049-0cfed4f6a45d',
    body: [
      {
        p: 'US banks collected an estimated $6.9 billion in overdraft and non-sufficient funds fees over the past year, down 38% from the pre-reform peak. Most large institutions have eliminated NSF fees entirely, introduced grace periods, and capped the number of overdraft charges per day.',
      },
      { h2: 'Competition moved faster than rulemaking' },
      {
        p: 'The reductions largely preceded regulatory mandates. Digital-first challengers offered fee-free overdraft buffers as an acquisition tool, and once one large incumbent matched, the rest followed to avoid becoming the visibly expensive option. Announced regulatory intent accelerated a process that competition had already started.',
      },
      {
        p: 'The distributional effect is meaningful. Overdraft fees were concentrated among a small minority of accounts — roughly 8% of customers generated the majority of charges, typically the same households month after month.',
      },
      {
        quote:
          'It was a product where a small group of customers with volatile income paid for everyone else’s free checking, and it did not survive being described that way in public.',
      },
      { h2: 'Where the revenue went instead' },
      {
        ul: [
          'Subscription accounts bundling early wage access, buffers and credit monitoring for a flat monthly fee.',
          'Small-dollar instalment credit at disclosed APRs, which regulators have encouraged as a substitute.',
          'Higher interchange from deeper debit engagement, as fee-free accounts attract primary banking relationships.',
        ],
      },
      {
        p: 'Aggregate consumer fee revenue is therefore close to flat. What has changed is the structure: pricing is disclosed up front and spread across a customer base rather than concentrated on the households least able to absorb it.',
      },
    ],
  },
  {
    n: 44,
    title: 'Community Banks Win a Carve-Out in New Capital Rules',
    slug: 'community-banks-win-carve-out-new-capital-rules',
    excerpt:
      'Institutions under $10 billion in assets will use a simplified leverage test, avoiding the operational risk calculations applied to larger banks.',
    category: 'banking',
    author: 'robert-feldman',
    publishedAt: '2026-07-20T09:40:00Z',
    readingTime: 5,
    photo: 'photo-1556761175-b413da4baf72',
    body: [
      {
        p: 'Final capital rules published this week exempt banks under $10 billion in assets from the operational risk and market risk calculations that apply to larger institutions. Qualifying banks may instead satisfy requirements through a simplified leverage ratio test, provided they meet limits on trading assets and off-balance-sheet exposure.',
      },
      { h2: 'Proportionality as the organising principle' },
      {
        p: 'The rationale is that the risks the full framework is designed to capture — trading book losses, complex operational failures, cross-border exposure — are largely absent from a bank that takes local deposits and makes local loans. Requiring the same modelling apparatus imposes real cost without producing better supervision.',
      },
      {
        p: 'Community bank trade groups had argued that compliance cost per dollar of assets falls sharply with scale, effectively acting as a regulatory subsidy for consolidation. The exemption is an acknowledgement of that dynamic.',
      },
      {
        quote:
          'A bank with no trading desk should not have to model trading risk. That is not deregulation, it is arithmetic.',
      },
      { h2: 'What larger banks face' },
      {
        p: 'Institutions above the threshold see requirements rise modestly, with the largest increases falling on those with significant trading operations or heavy fee-based businesses. Aggregate common equity tier 1 requirements across the group increase by an estimated 60 to 90 basis points, phased over three years.',
      },
      {
        p: 'Most affected banks already hold capital above the new minimums, so the binding effect is on the pace of buybacks rather than on lending capacity. Several have guided to slightly lower repurchase volumes over the phase-in period while maintaining dividend growth.',
      },
    ],
  },
]


// ============================================================
// Derived exports
// ============================================================

/** Newest first. Every consumer of this data assumes reverse-chronological. */
function byNewestFirst<T extends { publishedAt: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

const orderedSeeds = byNewestFirst(articleSeeds)

export const sampleArticles: ArticleCard[] = orderedSeeds.map((seed) => {
  const author = sampleAuthors[seed.author]
  const category = categoriesBySlug[seed.category]

  return {
    _id: `article-${seed.n}`,
    title: seed.title,
    slug: { current: seed.slug },
    excerpt: seed.excerpt,
    author: { name: author.name, imageUrl: author.imageUrl },
    publishedAt: seed.publishedAt,
    category: { title: category.title, slug: category.slug },
    imageUrl: cover(seed.photo),
    readingTime: seed.readingTime,
  }
})

export const sampleFullArticles: Record<string, Article> = orderedSeeds.reduce(
  (acc, seed) => {
    acc[seed.slug] = {
      _id: `article-${seed.n}`,
      title: seed.title,
      slug: { current: seed.slug },
      excerpt: seed.excerpt,
      body: buildBody(seed.body),
      author: sampleAuthors[seed.author],
      publishedAt: seed.publishedAt,
      category: categoriesBySlug[seed.category],
      imageUrl: cover(seed.photo),
      readingTime: seed.readingTime,
    }
    return acc
  },
  {} as Record<string, Article>
)

// ============================================================
// Helper Functions
// ============================================================

/**
 * Get all sample articles (newest first).
 */
export function getSampleArticles(): ArticleCard[] {
  return sampleArticles
}

/**
 * Get latest N sample articles.
 */
export function getLatestSampleArticles(limit: number): ArticleCard[] {
  return sampleArticles.slice(0, Math.max(0, limit))
}

/**
 * Get sample articles filtered by category (newest first).
 */
export function getSampleArticlesByCategory(categorySlug: string): ArticleCard[] {
  return sampleArticles.filter(
    (article) => article.category.slug.current === categorySlug
  )
}

/**
 * Get a full sample article by slug.
 */
export function getSampleArticleBySlug(slug: string): Article | null {
  return sampleFullArticles[slug] || null
}

/**
 * Get related sample articles (same category, excluding current).
 */
export function getRelatedSampleArticles(
  categorySlug: string,
  currentArticleId: string,
  limit: number = 3
): ArticleCard[] {
  return sampleArticles
    .filter(
      (article) =>
        article.category.slug.current === categorySlug &&
        article._id !== currentArticleId
    )
    .slice(0, Math.max(0, limit))
}
