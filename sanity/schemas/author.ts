import { defineType, defineField } from 'sanity'

/**
 * Author document type for Sanity CMS
 *
 * Represents a content author with biographical information.
 */
const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      description: 'A brief biography of the author',
    }),
    defineField({
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',
      description:
        "The author's professional role, e.g. 'Senior Cryptocurrency Correspondent'. Shown on the byline/bio page and emitted in Person schema.",
    }),
    defineField({
      name: 'credentials',
      title: 'Credentials',
      type: 'string',
      description:
        'A short qualification line (e.g. "CFA, MBA" or "Former research economist, Federal Reserve Bank of New York"). Used for E-E-A-T to establish author expertise.',
    }),
    defineField({
      name: 'sameAs',
      title: 'Profile links / sameAs',
      type: 'array',
      of: [{ type: 'url' }],
      description:
        "The author's own professional profile URLs (LinkedIn, personal site). Emitted as schema.org sameAs on the author's Person markup for E-E-A-T.",
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})

export default author
