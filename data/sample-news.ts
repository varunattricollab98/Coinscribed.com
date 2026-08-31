import type { ArticleCard, Article, Category, PortableTextBlock } from '@/lib/sanity-queries'

// ============================================================
// Sample Categories
// ============================================================

export const sampleCategories: Category[] = [
  {
    _id: 'cat-crypto',
    title: 'Crypto',
    slug: { current: 'crypto' },
    description: 'Latest cryptocurrency news covering Bitcoin, Ethereum, DeFi, NFTs, and blockchain technology.',
  },
  {
    _id: 'cat-economy',
    title: 'Economy',
    slug: { current: 'economy' },
    description: 'Macroeconomic news including GDP, inflation, employment data, and fiscal policy updates.',
  },
  {
    _id: 'cat-markets',
    title: 'Markets',
    slug: { current: 'markets' },
    description: 'Stock market, bonds, commodities, forex, and investment analysis.',
  },
  {
    _id: 'cat-banking',
    title: 'Banking',
    slug: { current: 'banking' },
    description: 'Banking industry news, regulations, fintech innovations, and digital banking updates.',
  },
]

// ============================================================
// Sample Articles (Hardcoded Fallback Data)
// ============================================================

export const sampleArticles: ArticleCard[] = [
  {
    _id: 'article-1',
    title: 'Bitcoin Surges Past $100K as Institutional Demand Reaches Record Highs',
    slug: { current: 'bitcoin-surges-past-100k-institutional-demand' },
    excerpt:
      'Bitcoin has crossed the $100,000 milestone for the first time, driven by unprecedented institutional inflows from major US financial firms and growing ETF adoption.',
    author: { name: 'Michael Torres' },
    publishedAt: '2025-01-15T09:00:00Z',
    category: { title: 'Crypto', slug: { current: 'crypto' } },
    imageUrl: 'https://picsum.photos/seed/bitcoin-surges-past-100k-institutional-demand/800/450',
    readingTime: 5,
  },
  {
    _id: 'article-2',
    title: 'Federal Reserve Holds Rates Steady, Signals Potential Cut in Q2 2025',
    slug: { current: 'federal-reserve-holds-rates-signals-cut-q2-2025' },
    excerpt:
      'The Federal Reserve maintained its benchmark interest rate at the January meeting while hinting at a possible rate reduction in the second quarter as inflation continues to cool.',
    author: { name: 'Sarah Chen' },
    publishedAt: '2025-01-14T14:30:00Z',
    category: { title: 'Economy', slug: { current: 'economy' } },
    imageUrl: 'https://picsum.photos/seed/federal-reserve-holds-rates-signals-cut-q2-2025/800/450',
    readingTime: 5,
  },
  {
    _id: 'article-3',
    title: 'S&P 500 Hits New All-Time High on Strong Earnings Season',
    slug: { current: 'sp500-new-all-time-high-strong-earnings' },
    excerpt:
      'The S&P 500 reached a new record high as fourth-quarter earnings reports from major tech companies exceeded analyst expectations across the board.',
    author: { name: 'David Park' },
    publishedAt: '2025-01-13T11:00:00Z',
    category: { title: 'Markets', slug: { current: 'markets' } },
    imageUrl: 'https://picsum.photos/seed/sp500-new-all-time-high-strong-earnings/800/450',
    readingTime: 5,
  },
  {
    _id: 'article-4',
    title: 'JPMorgan Chase Launches AI-Powered Financial Planning Platform',
    slug: { current: 'jpmorgan-launches-ai-financial-planning-platform' },
    excerpt:
      'JPMorgan Chase unveiled a new artificial intelligence-driven financial planning tool for retail customers, aiming to democratize wealth management services.',
    author: { name: 'Emily Rodriguez' },
    publishedAt: '2025-01-12T08:45:00Z',
    category: { title: 'Banking', slug: { current: 'banking' } },
    imageUrl: 'https://picsum.photos/seed/jpmorgan-launches-ai-financial-planning-platform/800/450',
    readingTime: 5,
  },
  {
    _id: 'article-5',
    title: 'Ethereum Layer 2 Solutions Process Over 10 Million Daily Transactions',
    slug: { current: 'ethereum-layer-2-10-million-daily-transactions' },
    excerpt:
      'Ethereum scaling solutions have collectively surpassed 10 million daily transactions, marking a major milestone for the network as gas fees remain at historic lows.',
    author: { name: 'Alex Nakamura' },
    publishedAt: '2025-01-11T16:20:00Z',
    category: { title: 'Crypto', slug: { current: 'crypto' } },
    imageUrl: 'https://picsum.photos/seed/ethereum-layer-2-10-million-daily-transactions/800/450',
    readingTime: 5,
  },
  {
    _id: 'article-6',
    title: 'US Housing Market Shows Signs of Recovery as Mortgage Rates Decline',
    slug: { current: 'us-housing-market-recovery-mortgage-rates-decline' },
    excerpt:
      'The US housing market is showing renewed activity as 30-year fixed mortgage rates dropped below 6% for the first time since early 2023, boosting buyer confidence.',
    author: { name: 'Jennifer Walsh' },
    publishedAt: '2025-01-10T10:15:00Z',
    category: { title: 'Economy', slug: { current: 'economy' } },
    imageUrl: 'https://picsum.photos/seed/us-housing-market-recovery-mortgage-rates-decline/800/450',
    readingTime: 5,
  },
  {
    _id: 'article-7',
    title: 'Tesla Stock Rallies 15% After Record Q4 Vehicle Deliveries',
    slug: { current: 'tesla-rallies-15-percent-record-q4-deliveries' },
    excerpt:
      'Tesla shares jumped 15% in a single session after the company reported record fourth-quarter vehicle deliveries, beating Wall Street estimates by a wide margin.',
    author: { name: 'David Park' },
    publishedAt: '2025-01-09T13:00:00Z',
    category: { title: 'Markets', slug: { current: 'markets' } },
    imageUrl: 'https://picsum.photos/seed/tesla-rallies-15-percent-record-q4-deliveries/800/450',
    readingTime: 5,
  },
  {
    _id: 'article-8',
    title: 'New FDIC Rules Strengthen Consumer Protection for Digital Banking',
    slug: { current: 'fdic-rules-strengthen-digital-banking-protection' },
    excerpt:
      'The FDIC announced updated regulations that extend traditional deposit insurance protections to cover funds held through digital banking platforms and fintech apps.',
    author: { name: 'Sarah Chen' },
    publishedAt: '2025-01-08T09:30:00Z',
    category: { title: 'Banking', slug: { current: 'banking' } },
    imageUrl: 'https://picsum.photos/seed/fdic-rules-strengthen-digital-banking-protection/800/450',
    readingTime: 5,
  },
  {
    _id: 'article-9',
    title: 'SEC Approves First Solana Spot ETF, Expanding Crypto Investment Options',
    slug: { current: 'sec-approves-first-solana-spot-etf' },
    excerpt:
      'The Securities and Exchange Commission approved the first Solana spot ETF, giving retail and institutional investors a new regulated way to gain exposure to the cryptocurrency.',
    author: { name: 'Michael Torres' },
    publishedAt: '2025-01-07T15:45:00Z',
    category: { title: 'Crypto', slug: { current: 'crypto' } },
    imageUrl: 'https://picsum.photos/seed/sec-approves-first-solana-spot-etf/800/450',
    readingTime: 5,
  },
  {
    _id: 'article-10',
    title: 'US Job Market Adds 280,000 Positions in December, Beating Forecasts',
    slug: { current: 'us-job-market-280000-positions-december' },
    excerpt:
      'The Bureau of Labor Statistics reported that the US economy added 280,000 nonfarm payroll jobs in December, well above the consensus estimate of 200,000.',
    author: { name: 'Jennifer Walsh' },
    publishedAt: '2025-01-06T08:00:00Z',
    category: { title: 'Economy', slug: { current: 'economy' } },
    imageUrl: 'https://picsum.photos/seed/us-job-market-280000-positions-december/800/450',
    readingTime: 5,
  },
  {
    _id: 'article-11',
    title: 'Goldman Sachs Predicts Gold Will Reach $2,800 by Mid-2025',
    slug: { current: 'goldman-sachs-gold-2800-prediction-mid-2025' },
    excerpt:
      'Goldman Sachs raised its gold price target to $2,800 per ounce by mid-2025, citing ongoing geopolitical uncertainty and central bank purchasing as key drivers.',
    author: { name: 'Alex Nakamura' },
    publishedAt: '2025-01-05T12:30:00Z',
    category: { title: 'Markets', slug: { current: 'markets' } },
    imageUrl: 'https://picsum.photos/seed/goldman-sachs-gold-2800-prediction-mid-2025/800/450',
    readingTime: 5,
  },
  {
    _id: 'article-12',
    title: 'Bank of America Expands Zero-Fee Checking to All Customers Nationwide',
    slug: { current: 'bank-of-america-zero-fee-checking-nationwide' },
    excerpt:
      'Bank of America announced the elimination of monthly maintenance fees on all consumer checking accounts, joining a growing trend of fee-free banking among major US banks.',
    author: { name: 'Emily Rodriguez' },
    publishedAt: '2025-01-04T11:00:00Z',
    category: { title: 'Banking', slug: { current: 'banking' } },
    imageUrl: 'https://picsum.photos/seed/bank-of-america-zero-fee-checking-nationwide/800/450',
    readingTime: 5,
  },
]

// ============================================================
// Sample Full Articles (for detail pages)
// ============================================================

function createArticleBody(paragraphs: string[]): PortableTextBlock[] {
  return paragraphs.map((text, index) => ({
    _key: `block-${index}`,
    _type: 'block',
    style: 'normal',
    children: [
      {
        _key: `span-${index}`,
        _type: 'span',
        text,
        marks: [],
      },
    ],
    markDefs: [],
  }))
}

export const sampleFullArticles: Record<string, Article> = {
  'bitcoin-surges-past-100k-institutional-demand': {
    _id: 'article-1',
    title: 'Bitcoin Surges Past $100K as Institutional Demand Reaches Record Highs',
    slug: { current: 'bitcoin-surges-past-100k-institutional-demand' },
    excerpt:
      'Bitcoin has crossed the $100,000 milestone for the first time, driven by unprecedented institutional inflows from major US financial firms and growing ETF adoption.',
    imageUrl: 'https://picsum.photos/seed/bitcoin-surges-past-100k-institutional-demand/1200/675',
    readingTime: 5,
    body: createArticleBody([
      'Bitcoin crossed the $100,000 threshold early Wednesday morning, marking a historic milestone for the cryptocurrency that was created just sixteen years ago. The move was fueled by a combination of record institutional inflows, growing adoption of spot Bitcoin ETFs, and a broader shift in how traditional financial institutions view digital assets.',
      'Data from major exchanges shows that institutional buying volume has increased by over 340% compared to the same period last year. BlackRock\'s iShares Bitcoin Trust (IBIT) alone has accumulated more than $45 billion in assets under management since its January 2024 launch, making it one of the most successful ETF launches in history.',
      'Market analysts point to several catalysts behind the surge. The upcoming Bitcoin halving event, combined with limited sell-side liquidity and strong demand from pension funds and sovereign wealth funds, has created what some describe as a "supply squeeze" in the market.',
      '"We are witnessing a fundamental shift in how institutional capital views Bitcoin," said Marcus Thompson, Chief Investment Officer at Digital Asset Capital Management. "What was once considered a speculative asset is now being allocated alongside traditional safe-haven assets like gold and US Treasuries."',
      'The rally has also lifted the broader cryptocurrency market, with Ethereum, Solana, and other major altcoins posting double-digit gains over the past week. The total cryptocurrency market capitalization now exceeds $4 trillion for the first time.',
      'Despite the euphoria, some analysts urge caution. Technical indicators suggest the market may be entering overbought territory in the short term, and regulatory developments in the US and Europe could introduce volatility. However, the long-term consensus among institutional investors remains overwhelmingly bullish.',
    ]),
    author: {
      _id: 'author-1',
      name: 'Michael Torres',
      slug: { current: 'michael-torres' },
      bio: 'Michael Torres is a senior cryptocurrency analyst with over 8 years of experience covering digital assets and blockchain technology for major financial publications.',
      imageUrl: 'https://picsum.photos/seed/michael-torres/128/128',
    },
    publishedAt: '2025-01-15T09:00:00Z',
    category: {
      _id: 'cat-crypto',
      title: 'Crypto',
      slug: { current: 'crypto' },
    },
  },
  'federal-reserve-holds-rates-signals-cut-q2-2025': {
    _id: 'article-2',
    title: 'Federal Reserve Holds Rates Steady, Signals Potential Cut in Q2 2025',
    slug: { current: 'federal-reserve-holds-rates-signals-cut-q2-2025' },
    excerpt:
      'The Federal Reserve maintained its benchmark interest rate at the January meeting while hinting at a possible rate reduction in the second quarter as inflation continues to cool.',
    imageUrl: 'https://picsum.photos/seed/federal-reserve-holds-rates-signals-cut-q2-2025/1200/675',
    readingTime: 5,
    body: createArticleBody([
      'The Federal Open Market Committee (FOMC) voted unanimously to keep the federal funds rate unchanged at 4.25% to 4.50% at its January 2025 meeting, as widely expected by markets. However, the accompanying statement and press conference provided clear signals that rate cuts could begin as early as the second quarter.',
      'Fed Chair Jerome Powell noted during the post-meeting press conference that "the committee is increasingly confident that inflation is moving sustainably toward our 2% objective." The latest Consumer Price Index data showed year-over-year inflation at 2.4%, down from a peak of 9.1% in June 2022.',
      'The updated dot plot revealed that a majority of FOMC members now project at least two rate cuts in 2025, with the first likely coming at the May or June meeting. This represents a slightly more dovish shift from the December projections.',
      'Bond markets reacted positively to the news, with the 10-year Treasury yield falling 8 basis points to 4.12%. The S&P 500 gained 0.6% in afternoon trading as investors digested the implications for corporate borrowing costs and consumer spending.',
      'Economists at major Wall Street banks have updated their forecasts accordingly. Goldman Sachs now expects three rate cuts in 2025, while Morgan Stanley projects two cuts totaling 50 basis points. Both firms cite the combination of falling inflation and a gradually cooling labor market as the primary drivers.',
      'The housing market stands to benefit significantly from lower rates. Mortgage applications have already begun to tick upward in anticipation of rate reductions, and real estate analysts expect a meaningful increase in home sales volume once rates drop below the 6% threshold.',
    ]),
    author: {
      _id: 'author-2',
      name: 'Sarah Chen',
      slug: { current: 'sarah-chen' },
      bio: 'Sarah Chen covers macroeconomics and Federal Reserve policy. She previously worked as an economist at the Federal Reserve Bank of New York.',
      imageUrl: 'https://picsum.photos/seed/sarah-chen/128/128',
    },
    publishedAt: '2025-01-14T14:30:00Z',
    category: {
      _id: 'cat-economy',
      title: 'Economy',
      slug: { current: 'economy' },
    },
  },
  'sp500-new-all-time-high-strong-earnings': {
    _id: 'article-3',
    title: 'S&P 500 Hits New All-Time High on Strong Earnings Season',
    slug: { current: 'sp500-new-all-time-high-strong-earnings' },
    excerpt:
      'The S&P 500 reached a new record high as fourth-quarter earnings reports from major tech companies exceeded analyst expectations across the board.',
    imageUrl: 'https://picsum.photos/seed/sp500-new-all-time-high-strong-earnings/1200/675',
    readingTime: 5,
    body: createArticleBody([
      'The S&P 500 closed at a fresh all-time high of 5,420 on Thursday, gaining 1.2% in a broad-based rally driven by better-than-expected corporate earnings. The move extends the index\'s year-to-date gain to 4.8% and marks the 12th record close in the past two months.',
      'Technology stocks led the advance, with the Nasdaq Composite rising 1.8%. Apple, Microsoft, and Nvidia all reported fourth-quarter results that beat consensus estimates on both revenue and earnings per share. The so-called "Magnificent Seven" stocks have collectively risen 18% since the start of earnings season.',
      'Beyond tech, strength was broad-based. The equal-weighted S&P 500 also hit a new high, suggesting the rally is expanding beyond the mega-cap names that dominated 2024. Industrials, financials, and healthcare sectors all posted gains of more than 1%.',
      '"This is exactly the kind of market breadth expansion that supports a sustainable bull market," said Patricia Owens, Chief Market Strategist at Meridian Wealth Advisors. "When the average stock is participating in the rally, it tells us the economic fundamentals are genuinely improving."',
      'Corporate profit margins have proven more resilient than bears expected, with S&P 500 companies on track to deliver year-over-year earnings growth of approximately 12% for Q4 2024. Revenue growth has also been solid at 5.3%, suggesting companies are achieving real organic growth rather than relying solely on cost cuts.',
      'Looking ahead, analyst consensus estimates call for 10% earnings growth in 2025, supported by AI-driven productivity gains, stable consumer spending, and a gradually loosening monetary policy environment. However, valuations remain elevated at roughly 22 times forward earnings, leaving limited room for multiple expansion.',
    ]),
    author: {
      _id: 'author-3',
      name: 'David Park',
      slug: { current: 'david-park' },
      bio: 'David Park is a markets reporter covering US equities, fixed income, and investment strategy for institutional and retail audiences.',
      imageUrl: 'https://picsum.photos/seed/david-park/128/128',
    },
    publishedAt: '2025-01-13T11:00:00Z',
    category: {
      _id: 'cat-markets',
      title: 'Markets',
      slug: { current: 'markets' },
    },
  },
  'jpmorgan-launches-ai-financial-planning-platform': {
    _id: 'article-4',
    title: 'JPMorgan Chase Launches AI-Powered Financial Planning Platform',
    slug: { current: 'jpmorgan-launches-ai-financial-planning-platform' },
    excerpt:
      'JPMorgan Chase unveiled a new artificial intelligence-driven financial planning tool for retail customers, aiming to democratize wealth management services.',
    imageUrl: 'https://picsum.photos/seed/jpmorgan-launches-ai-financial-planning-platform/1200/675',
    readingTime: 5,
    body: createArticleBody([
      'JPMorgan Chase today launched "Chase Advisor AI," an artificial intelligence-powered financial planning platform available to all Chase checking and savings account holders at no additional cost. The tool marks one of the largest deployments of generative AI in consumer banking to date.',
      'The platform uses proprietary large language models trained on decades of financial planning best practices to provide personalized recommendations on budgeting, saving, investing, and retirement planning. Users can interact with the AI through natural language conversations within the Chase mobile app.',
      '"Our goal is to make high-quality financial advice accessible to every American, not just those with a million-dollar portfolio," said Chase Consumer Banking CEO Maria Gonzalez during the launch event. "AI allows us to deliver institutional-grade insights at consumer scale."',
      'Early beta testing with over 500,000 customers showed promising results. Users who engaged with the AI advisor increased their savings rate by an average of 3.2 percentage points and were 40% more likely to contribute to retirement accounts compared to a control group.',
      'The move intensifies competition in the digital banking space, where fintech companies like Wealthfront, Betterment, and SoFi have been offering automated financial advice for years. However, JPMorgan\'s massive customer base of over 80 million households gives it a significant distribution advantage.',
      'Privacy and security have been central to the platform\'s design. All conversations are encrypted end-to-end, and the AI does not share personal financial data with third parties. The system is also designed with guardrails to prevent unsuitable investment recommendations, with human advisors available for escalation on complex topics.',
    ]),
    author: {
      _id: 'author-4',
      name: 'Emily Rodriguez',
      slug: { current: 'emily-rodriguez' },
      bio: 'Emily Rodriguez covers the banking industry with a focus on digital transformation, fintech partnerships, and regulatory developments affecting US financial institutions.',
      imageUrl: 'https://picsum.photos/seed/emily-rodriguez/128/128',
    },
    publishedAt: '2025-01-12T08:45:00Z',
    category: {
      _id: 'cat-banking',
      title: 'Banking',
      slug: { current: 'banking' },
    },
  },
  'ethereum-layer-2-10-million-daily-transactions': {
    _id: 'article-5',
    title: 'Ethereum Layer 2 Solutions Process Over 10 Million Daily Transactions',
    slug: { current: 'ethereum-layer-2-10-million-daily-transactions' },
    excerpt:
      'Ethereum scaling solutions have collectively surpassed 10 million daily transactions, marking a major milestone for the network as gas fees remain at historic lows.',
    imageUrl: 'https://picsum.photos/seed/ethereum-layer-2-10-million-daily-transactions/1200/675',
    readingTime: 5,
    body: createArticleBody([
      'Ethereum Layer 2 networks collectively processed more than 10 million transactions in a single day for the first time on Tuesday, according to data from L2Beat. The milestone represents a tenfold increase from the same period one year ago and validates the rollup-centric scaling roadmap that Ethereum has pursued.',
      'Arbitrum led the pack with approximately 3.8 million daily transactions, followed by Base (Coinbase\'s L2) at 2.9 million and Optimism at 2.1 million. Other significant contributors included zkSync Era, Linea, and Starknet, all of which have seen substantial growth in recent months.',
      'The growth in L2 activity has been accompanied by dramatically lower transaction costs. The average transaction fee across major L2 networks is now below $0.01, compared to over $50 during peak congestion periods on Ethereum mainnet in 2021. The Dencun upgrade, which introduced blob transactions in March 2024, was the key technical catalyst for this cost reduction.',
      '"Layer 2 networks have effectively solved the scalability trilemma for everyday users," explained blockchain researcher Dr. Hannah Kim. "You get Ethereum\'s security guarantees with transaction costs and speeds that rival centralized payment networks."',
      'Decentralized finance (DeFi) remains the primary use case, with lending protocols, decentralized exchanges, and yield farming platforms driving the majority of L2 transactions. However, gaming, social media, and real-world asset tokenization are growing categories that could push daily volumes even higher.',
      'The success of L2 networks has also reignited the debate about Ethereum\'s mainnet fee revenue. With more activity moving to L2s, Ethereum mainnet has seen periods of deflation where ETH burned through EIP-1559 exceeds new issuance, potentially making ETH an increasingly scarce asset over time.',
    ]),
    author: {
      _id: 'author-5',
      name: 'Alex Nakamura',
      slug: { current: 'alex-nakamura' },
      bio: 'Alex Nakamura is a blockchain technology reporter specializing in Ethereum ecosystem developments, DeFi protocols, and Layer 2 scaling solutions.',
      imageUrl: 'https://picsum.photos/seed/alex-nakamura/128/128',
    },
    publishedAt: '2025-01-11T16:20:00Z',
    category: {
      _id: 'cat-crypto',
      title: 'Crypto',
      slug: { current: 'crypto' },
    },
  },
  'us-housing-market-recovery-mortgage-rates-decline': {
    _id: 'article-6',
    title: 'US Housing Market Shows Signs of Recovery as Mortgage Rates Decline',
    slug: { current: 'us-housing-market-recovery-mortgage-rates-decline' },
    excerpt:
      'The US housing market is showing renewed activity as 30-year fixed mortgage rates dropped below 6% for the first time since early 2023, boosting buyer confidence.',
    imageUrl: 'https://picsum.photos/seed/us-housing-market-recovery-mortgage-rates-decline/1200/675',
    readingTime: 5,
    body: createArticleBody([
      'The US housing market is experiencing its first meaningful uptick in activity since the Federal Reserve began raising interest rates in 2022. The average 30-year fixed mortgage rate fell to 5.87% this week, according to Freddie Mac, crossing below the psychologically important 6% threshold for the first time in nearly two years.',
      'Mortgage application volume surged 22% week-over-week following the rate decline, with purchase applications rising 18% and refinancing activity jumping 31%. The Mortgage Bankers Association noted this represents the strongest weekly gain in applications since spring 2023.',
      'Home sales data is also improving. The National Association of Realtors reported that existing home sales rose 4.2% month-over-month in December, the third consecutive monthly increase. Pending home sales, a leading indicator, are up 7.1% year-over-year.',
      '"The lock-in effect is starting to weaken," said Chief Economist Robert Harrison at the National Housing Foundation. "Homeowners who locked in sub-3% rates during the pandemic are more willing to sell now that the gap between their current rate and the prevailing rate has narrowed considerably."',
      'First-time homebuyers are particularly benefiting from the improved conditions. Their share of total purchases has risen to 33%, up from a low of 26% in mid-2023. Lower rates translate to approximately $200 per month in savings on a median-priced US home compared to peak rate levels.',
      'However, housing supply remains constrained in many markets. Active listings are still 25% below pre-pandemic levels nationally, which has kept price appreciation positive at around 4% year-over-year. Economists expect a gradual normalization of inventory through 2025 as more sellers enter the market.',
    ]),
    author: {
      _id: 'author-6',
      name: 'Jennifer Walsh',
      slug: { current: 'jennifer-walsh' },
      bio: 'Jennifer Walsh covers residential real estate, mortgage markets, and housing policy for Coinscribed. She holds a degree in urban economics from MIT.',
      imageUrl: 'https://picsum.photos/seed/jennifer-walsh/128/128',
    },
    publishedAt: '2025-01-10T10:15:00Z',
    category: {
      _id: 'cat-economy',
      title: 'Economy',
      slug: { current: 'economy' },
    },
  },
  'tesla-rallies-15-percent-record-q4-deliveries': {
    _id: 'article-7',
    title: 'Tesla Stock Rallies 15% After Record Q4 Vehicle Deliveries',
    slug: { current: 'tesla-rallies-15-percent-record-q4-deliveries' },
    excerpt:
      'Tesla shares jumped 15% in a single session after the company reported record fourth-quarter vehicle deliveries, beating Wall Street estimates by a wide margin.',
    imageUrl: 'https://picsum.photos/seed/tesla-rallies-15-percent-record-q4-deliveries/1200/675',
    readingTime: 5,
    body: createArticleBody([
      'Tesla shares surged 15.3% on Wednesday, their best single-day performance since November 2023, after the company reported record fourth-quarter vehicle deliveries of 530,000 units. The figure exceeded the consensus Wall Street estimate of 483,000 units by nearly 10%.',
      'The strong delivery numbers put Tesla\'s full-year 2024 production at 1.98 million vehicles, narrowly missing the 2 million mark but representing a 14% increase over 2023. CEO Elon Musk posted on social media that the company expects to cross 2.5 million deliveries in 2025.',
      'Model Y remained the company\'s best-selling vehicle globally, while the recently launched Cybertruck contributed approximately 50,000 units to the quarterly total. The more affordable Model Q, expected to launch in mid-2025 with a starting price below $30,000, is anticipated to drive the next wave of volume growth.',
      'Analysts raised their price targets following the delivery report. Morgan Stanley increased its target to $420 from $355, citing improved execution and market share gains in China and Europe. Goldman Sachs moved to $390, emphasizing Tesla\'s growing energy storage business as a "massively underappreciated" revenue driver.',
      'Tesla\'s automotive gross margins are also expected to improve in 2025 as production costs continue to decline and the company benefits from scale efficiencies at its newer factories in Austin, Texas, and Brandenburg, Germany. Wall Street consensus expects automotive margins to return to the 20% range by mid-year.',
      'The rally in Tesla shares lifted the broader EV sector, with Rivian gaining 8% and Lucid rising 6% in sympathy. The performance also pushed Tesla\'s market capitalization back above $900 billion, reinforcing its position as the world\'s most valuable automaker.',
    ]),
    author: {
      _id: 'author-3',
      name: 'David Park',
      slug: { current: 'david-park' },
      bio: 'David Park is a markets reporter covering US equities, fixed income, and investment strategy for institutional and retail audiences.',
      imageUrl: 'https://picsum.photos/seed/david-park/128/128',
    },
    publishedAt: '2025-01-09T13:00:00Z',
    category: {
      _id: 'cat-markets',
      title: 'Markets',
      slug: { current: 'markets' },
    },
  },
  'fdic-rules-strengthen-digital-banking-protection': {
    _id: 'article-8',
    title: 'New FDIC Rules Strengthen Consumer Protection for Digital Banking',
    slug: { current: 'fdic-rules-strengthen-digital-banking-protection' },
    excerpt:
      'The FDIC announced updated regulations that extend traditional deposit insurance protections to cover funds held through digital banking platforms and fintech apps.',
    imageUrl: 'https://picsum.photos/seed/fdic-rules-strengthen-digital-banking-protection/1200/675',
    readingTime: 5,
    body: createArticleBody([
      'The Federal Deposit Insurance Corporation (FDIC) issued final rules today that clarify and strengthen deposit insurance coverage for consumers who hold funds through digital banking platforms, fintech applications, and banking-as-a-service providers. The rules take effect April 1, 2025.',
      'Under the new framework, fintech companies that partner with FDIC-insured banks must clearly disclose to customers which specific bank holds their deposits, provide real-time account statements, and maintain detailed records that allow the FDIC to quickly identify each depositor in the event of a bank failure.',
      'The rulemaking was prompted by the collapse of Synapse Financial Technologies in mid-2024, which left thousands of consumers temporarily unable to access funds held through various fintech apps. The incident highlighted gaps in the regulatory framework governing the relationship between technology companies and their banking partners.',
      '"These rules ensure that Americans who bank through digital platforms receive the same protections as those who walk into a traditional bank branch," said FDIC Chairman Martin Gruenberg. "Technology should enhance financial inclusion, not create new risks for consumers."',
      'Industry reaction has been largely positive, with major fintech players expressing support for the clarity the rules provide. "Clear regulations create a level playing field and build consumer trust in digital banking," said the CEO of a leading neobank. "We welcome these changes."',
      'Consumer advocacy groups praised the move but called for additional measures, including mandatory capital requirements for fintech intermediaries and a requirement for instant fund portability. The FDIC indicated it would continue evaluating the evolving digital banking landscape and consider additional rulemaking as needed.',
    ]),
    author: {
      _id: 'author-2',
      name: 'Sarah Chen',
      slug: { current: 'sarah-chen' },
      bio: 'Sarah Chen covers macroeconomics and Federal Reserve policy. She previously worked as an economist at the Federal Reserve Bank of New York.',
      imageUrl: 'https://picsum.photos/seed/sarah-chen/128/128',
    },
    publishedAt: '2025-01-08T09:30:00Z',
    category: {
      _id: 'cat-banking',
      title: 'Banking',
      slug: { current: 'banking' },
    },
  },
  'sec-approves-first-solana-spot-etf': {
    _id: 'article-9',
    title: 'SEC Approves First Solana Spot ETF, Expanding Crypto Investment Options',
    slug: { current: 'sec-approves-first-solana-spot-etf' },
    excerpt:
      'The Securities and Exchange Commission approved the first Solana spot ETF, giving retail and institutional investors a new regulated way to gain exposure to the cryptocurrency.',
    imageUrl: 'https://picsum.photos/seed/sec-approves-first-solana-spot-etf/1200/675',
    readingTime: 5,
    body: createArticleBody([
      'The US Securities and Exchange Commission approved applications for the first spot Solana exchange-traded fund on Friday, opening the door for the third cryptocurrency to receive ETF approval following Bitcoin and Ethereum. Trading is expected to begin within two weeks on major US exchanges.',
      'VanEck and Franklin Templeton received the initial approvals, with several other asset managers expected to receive clearance in the coming weeks. The approved funds will hold actual SOL tokens in custody, similar to the structure used by spot Bitcoin ETFs that launched in January 2024.',
      'Solana has emerged as one of the most actively used blockchain networks, processing over 65 million transactions daily with sub-second finality and transaction costs below one cent. Its high performance has attracted significant activity in DeFi, NFTs, and increasingly, real-world payment applications.',
      'The approval represents a significant shift in the SEC\'s approach to cryptocurrency regulation under new leadership. "The Commission recognizes that investor demand for regulated crypto exposure continues to grow, and our job is to ensure these products meet our disclosure and custody standards," the SEC stated in its approval order.',
      'SOL prices jumped 22% on the news, reaching $185 per token. Market analysts estimate the Solana ETFs could attract $3 billion to $8 billion in assets within the first year, based on relative market capitalization comparisons with Bitcoin and Ethereum ETF flows.',
      'The approval is expected to create a roadmap for additional cryptocurrency ETFs. Analysts widely expect XRP and Avalanche ETF applications to be filed in the coming months, further expanding the range of regulated crypto investment products available to US investors.',
    ]),
    author: {
      _id: 'author-1',
      name: 'Michael Torres',
      slug: { current: 'michael-torres' },
      bio: 'Michael Torres is a senior cryptocurrency analyst with over 8 years of experience covering digital assets and blockchain technology for major financial publications.',
      imageUrl: 'https://picsum.photos/seed/michael-torres/128/128',
    },
    publishedAt: '2025-01-07T15:45:00Z',
    category: {
      _id: 'cat-crypto',
      title: 'Crypto',
      slug: { current: 'crypto' },
    },
  },
  'us-job-market-280000-positions-december': {
    _id: 'article-10',
    title: 'US Job Market Adds 280,000 Positions in December, Beating Forecasts',
    slug: { current: 'us-job-market-280000-positions-december' },
    excerpt:
      'The Bureau of Labor Statistics reported that the US economy added 280,000 nonfarm payroll jobs in December, well above the consensus estimate of 200,000.',
    imageUrl: 'https://picsum.photos/seed/us-job-market-280000-positions-december/1200/675',
    readingTime: 5,
    body: createArticleBody([
      'The US economy added 280,000 nonfarm payroll jobs in December 2024, according to the Bureau of Labor Statistics, significantly beating the Dow Jones consensus estimate of 200,000. The unemployment rate ticked down to 3.9% from 4.0% in November, signaling continued labor market strength.',
      'Job gains were broad-based across sectors. Healthcare led with 65,000 new positions, followed by professional and business services at 48,000, leisure and hospitality at 42,000, and construction at 35,000. Government employment also grew by 38,000, primarily in state and local education.',
      'Average hourly earnings rose 0.3% month-over-month and 3.8% year-over-year, roughly in line with expectations. The pace of wage growth remains above inflation but has moderated from the 5%+ readings seen in 2022, reducing concerns about a wage-price spiral.',
      'The strong report initially sparked concerns that the Federal Reserve might delay rate cuts. However, Treasury yields quickly stabilized as investors noted that the employment gains were concentrated in sectors where demand has been structural rather than speculative.',
      '"This is a Goldilocks report," said Chief Economist Linda Martinez at First National Investment Bank. "Strong enough to confirm the economy is healthy, but with controlled wage growth that should keep the Fed on track for rate reductions in the second quarter."',
      'Labor force participation held steady at 62.5%, still below the pre-pandemic peak of 63.3%. Economists continue to monitor this gap, which is largely attributed to early retirements and demographic shifts. The prime-age participation rate (25-54 year olds) stands at a healthy 83.4%, near its all-time high.',
    ]),
    author: {
      _id: 'author-6',
      name: 'Jennifer Walsh',
      slug: { current: 'jennifer-walsh' },
      bio: 'Jennifer Walsh covers residential real estate, mortgage markets, and housing policy for Coinscribed. She holds a degree in urban economics from MIT.',
      imageUrl: 'https://picsum.photos/seed/jennifer-walsh/128/128',
    },
    publishedAt: '2025-01-06T08:00:00Z',
    category: {
      _id: 'cat-economy',
      title: 'Economy',
      slug: { current: 'economy' },
    },
  },
  'goldman-sachs-gold-2800-prediction-mid-2025': {
    _id: 'article-11',
    title: 'Goldman Sachs Predicts Gold Will Reach $2,800 by Mid-2025',
    slug: { current: 'goldman-sachs-gold-2800-prediction-mid-2025' },
    excerpt:
      'Goldman Sachs raised its gold price target to $2,800 per ounce by mid-2025, citing ongoing geopolitical uncertainty and central bank purchasing as key drivers.',
    imageUrl: 'https://picsum.photos/seed/goldman-sachs-gold-2800-prediction-mid-2025/1200/675',
    readingTime: 5,
    body: createArticleBody([
      'Goldman Sachs commodity strategists raised their gold price forecast to $2,800 per ounce by mid-2025, up from a previous target of $2,500. The bullish call comes as gold has already gained 15% over the past six months, driven by central bank purchases, geopolitical hedging, and anticipation of lower interest rates.',
      'Central bank gold buying has been a dominant theme, with institutions in China, India, Poland, and several Middle Eastern nations adding substantial quantities to their reserves. The World Gold Council reports that central banks purchased over 1,100 tonnes of gold in 2024, the third consecutive year of purchases exceeding 1,000 tonnes.',
      '"Central banks are de-dollarizing their reserves at an unprecedented pace," wrote Goldman\'s head of commodities research in the client note. "This structural shift in demand, combined with cyclical tailwinds from falling real interest rates, creates a highly supportive environment for gold prices."',
      'Geopolitical tensions continue to support safe-haven demand. Ongoing conflicts in Eastern Europe and the Middle East, combined with trade policy uncertainty, have increased the premium investors are willing to pay for assets perceived as stores of value outside the traditional financial system.',
      'Gold mining stocks have significantly underperformed the metal itself, creating what some analysts view as a value opportunity. The VanEck Gold Miners ETF (GDX) trades at roughly 8 times forward earnings, a steep discount to its historical average. If Goldman\'s price target is reached, miners could see outsized gains due to operating leverage.',
      'For US investors considering gold exposure, options include physical bullion, gold ETFs such as SPDR Gold Shares (GLD) and iShares Gold Trust (IAU), and gold mining equities. Financial advisors typically recommend a 5-10% portfolio allocation to gold and other precious metals as a diversification tool.',
    ]),
    author: {
      _id: 'author-5',
      name: 'Alex Nakamura',
      slug: { current: 'alex-nakamura' },
      bio: 'Alex Nakamura is a blockchain technology reporter specializing in Ethereum ecosystem developments, DeFi protocols, and Layer 2 scaling solutions.',
      imageUrl: 'https://picsum.photos/seed/alex-nakamura/128/128',
    },
    publishedAt: '2025-01-05T12:30:00Z',
    category: {
      _id: 'cat-markets',
      title: 'Markets',
      slug: { current: 'markets' },
    },
  },
  'bank-of-america-zero-fee-checking-nationwide': {
    _id: 'article-12',
    title: 'Bank of America Expands Zero-Fee Checking to All Customers Nationwide',
    slug: { current: 'bank-of-america-zero-fee-checking-nationwide' },
    excerpt:
      'Bank of America announced the elimination of monthly maintenance fees on all consumer checking accounts, joining a growing trend of fee-free banking among major US banks.',
    imageUrl: 'https://picsum.photos/seed/bank-of-america-zero-fee-checking-nationwide/1200/675',
    readingTime: 5,
    body: createArticleBody([
      'Bank of America announced today that it will eliminate monthly maintenance fees on all consumer checking accounts, effective March 1, 2025. The move affects approximately 35 million accounts and follows similar decisions by competitors Capital One and Ally Bank in recent years.',
      'The bank previously charged a $4.95 monthly maintenance fee on its SafePass checking account and a $12 fee on its Advantage Plus checking, unless customers met minimum balance or direct deposit requirements. Under the new policy, all checking accounts will be fee-free regardless of balance or activity.',
      '"Eliminating maintenance fees is the right thing to do for our customers," said Bank of America\'s Head of Consumer Banking in a statement. "Banking should be accessible to everyone, and we want to remove barriers that prevent people from building financial security."',
      'The decision will reduce Bank of America\'s annual revenue by an estimated $1.8 billion based on historical fee income data. However, analysts expect the move to improve customer retention, increase deposit gathering, and reduce regulatory and reputational risk associated with overdraft and maintenance fees.',
      'The broader US banking industry has been steadily moving away from consumer fees in response to competitive pressure from digital banks, regulatory scrutiny, and changing consumer expectations. Total bank fee income has declined 18% since 2019 after adjusting for inflation.',
      'Consumer advocates welcomed the announcement while noting that overdraft fees, which can cost customers $35 per incident at some banks, remain a larger source of financial burden. Bank of America reduced its overdraft fee to $10 in 2022 and has stated it is "continuing to evaluate" its overdraft policies. Industry watchers expect further fee reductions across the banking sector through 2025.',
    ]),
    author: {
      _id: 'author-4',
      name: 'Emily Rodriguez',
      slug: { current: 'emily-rodriguez' },
      bio: 'Emily Rodriguez covers the banking industry with a focus on digital transformation, fintech partnerships, and regulatory developments affecting US financial institutions.',
      imageUrl: 'https://picsum.photos/seed/emily-rodriguez/128/128',
    },
    publishedAt: '2025-01-04T11:00:00Z',
    category: {
      _id: 'cat-banking',
      title: 'Banking',
      slug: { current: 'banking' },
    },
  },
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Get all sample articles
 */
export function getSampleArticles(): ArticleCard[] {
  return sampleArticles
}

/**
 * Get latest N sample articles
 */
export function getLatestSampleArticles(limit: number): ArticleCard[] {
  return sampleArticles.slice(0, limit)
}

/**
 * Get sample articles filtered by category
 */
export function getSampleArticlesByCategory(categorySlug: string): ArticleCard[] {
  return sampleArticles.filter(
    (article) => article.category.slug.current === categorySlug
  )
}

/**
 * Get a full sample article by slug
 */
export function getSampleArticleBySlug(slug: string): Article | null {
  return sampleFullArticles[slug] || null
}

/**
 * Get related sample articles (same category, excluding current)
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
    .slice(0, limit)
}
