import article from './schemas/article'
import author from './schemas/author'
import category from './schemas/category'

/**
 * All Sanity schema types exported together.
 * Use this array when configuring your Sanity Studio.
 */
export const schemaTypes = [article, author, category]

export { article, author, category }
