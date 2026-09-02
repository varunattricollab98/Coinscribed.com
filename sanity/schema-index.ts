import article from './schemas/article'
import author from './schemas/author'
import category from './schemas/category'
import tableBlock from './schemas/tableBlock'

/**
 * All Sanity schema types exported together.
 * Use this array when configuring your Sanity Studio.
 */
export const schemaTypes = [article, author, category, tableBlock]

export { article, author, category, tableBlock }
