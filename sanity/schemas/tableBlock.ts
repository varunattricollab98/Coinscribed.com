import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * A simple, dependency-free comparison table for article bodies.
 *
 * We deliberately avoid the official `@sanity/table` plugin: its current
 * release peer-depends on React 19, while this project is on React 18, so
 * installing it would either fail or force a risky React upgrade. This hand
 * rolled object type stores the table as a header row plus data rows and
 * renders to a real HTML <table> in PortableTextRenderer.
 *
 * Shape:
 *   {
 *     _type: 'tableBlock',
 *     caption?: string,
 *     header: string[],            // column titles
 *     rows: { cells: string[] }[]  // each row's cells, in column order
 *   }
 */
const tableBlock = defineType({
  name: 'tableBlock',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption (optional)',
      type: 'string',
      description: 'Short description shown above the table.',
    }),
    defineField({
      name: 'header',
      title: 'Column Headers',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'One entry per column, e.g. "Bank", "Cut-off", "Fee".',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'row',
          title: 'Row',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
              description:
                'One entry per column, in the same order as the headers.',
            }),
          ],
          preview: {
            select: { cells: 'cells' },
            prepare({ cells }) {
              const list = Array.isArray(cells) ? (cells as string[]) : []
              return { title: list.join(' · ') || 'Empty row' }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { caption: 'caption', header: 'header', rows: 'rows' },
    prepare({ caption, header, rows }) {
      const cols = Array.isArray(header) ? header.length : 0
      const rowCount = Array.isArray(rows) ? rows.length : 0
      return {
        title: caption || 'Table',
        subtitle: `${cols} columns × ${rowCount} rows`,
      }
    },
  },
})

export default tableBlock
