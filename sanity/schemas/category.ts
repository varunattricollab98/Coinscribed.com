/**
 * Category document type for Sanity CMS
 *
 * Pre-defined categories: Crypto, Economy, Markets, Banking
 * Additional categories can be added via the Sanity Studio.
 */
const category = {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'A brief description of this category',
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}

export default category

/**
 * Pre-defined categories to create in Sanity Studio:
 *
 * 1. Crypto - Cryptocurrency news, Bitcoin, Ethereum, DeFi, NFTs
 * 2. Economy - Macroeconomics, GDP, inflation, employment data
 * 3. Markets - Stock market, bonds, commodities, forex
 * 4. Banking - Banking industry, regulations, fintech, digital banking
 */
export const defaultCategories = [
  {
    title: 'Crypto',
    slug: 'crypto',
    description:
      'Cryptocurrency news covering Bitcoin, Ethereum, DeFi, NFTs, and blockchain technology.',
  },
  {
    title: 'Economy',
    slug: 'economy',
    description:
      'Macroeconomic news including GDP, inflation, employment data, and fiscal policy.',
  },
  {
    title: 'Markets',
    slug: 'markets',
    description:
      'Stock market, bonds, commodities, forex, and investment analysis.',
  },
  {
    title: 'Banking',
    slug: 'banking',
    description:
      'Banking industry news, regulations, fintech innovations, and digital banking.',
  },
]
