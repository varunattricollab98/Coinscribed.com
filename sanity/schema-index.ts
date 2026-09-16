import article from './schemas/article'
import author from './schemas/author'
import category from './schemas/category'
import tableBlock from './schemas/tableBlock'
import subscriber from './schemas/subscriber'
import contactMessage from './schemas/contactMessage'

/**
 * All Sanity schema types exported together.
 * Use this array when configuring your Sanity Studio.
 */
export const schemaTypes = [
  article,
  author,
  category,
  tableBlock,
  subscriber,
  contactMessage,
]

export { article, author, category, tableBlock, subscriber, contactMessage }
