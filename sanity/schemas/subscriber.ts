import { defineType, defineField } from 'sanity'

/**
 * Newsletter subscriber document.
 *
 * Created by the public newsletter form via the /api/newsletter route (using a
 * server write token). Each signup is stored as one document so the owner can
 * see the list in Sanity Studio / the admin area and export it when connecting
 * a real email service later. Deliberately minimal — just the email, when they
 * signed up, and which form/page it came from.
 */
const subscriber = defineType({
  name: 'subscriber',
  title: 'Newsletter Subscriber',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) =>
        Rule.required()
          .email()
          .error('A valid email address is required'),
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description:
        'Which form/variant the signup came from (e.g. "homepage-rail", "footer-wide").',
    }),
  ],
  // Newest signups first in the Studio list.
  orderings: [
    {
      title: 'Newest first',
      name: 'subscribedAtDesc',
      by: [{ field: 'subscribedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'subscribedAt',
    },
  },
})

export default subscriber
