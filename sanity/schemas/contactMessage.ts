import { defineType, defineField } from 'sanity'

/**
 * Contact message document.
 *
 * Created by the public contact form via the /api/contact route (using the
 * same server write token as the newsletter). Each submission is stored as one
 * document so the owner can read and reply to enquiries from Sanity Studio /
 * the admin area. Deliberately minimal — name, email, optional subject, the
 * message, when it arrived, and which page it came from.
 *
 * Storing to Sanity (rather than sending an email directly from the app) keeps
 * the site dependency-free: no email provider/API key is required for the form
 * to work, and the owner can wire an email/Slack notification later by watching
 * this document type. Replies are sent from the owner's real inbox
 * (e.g. hello@coinscribed.com) to the address captured here.
 */
const contactMessage = defineType({
  name: 'contactMessage',
  title: 'Contact Message',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) =>
        Rule.required().email().error('A valid email address is required'),
    }),
    defineField({
      name: 'subject',
      title: 'Subject',
      type: 'string',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.required().min(10).max(5000),
    }),
    defineField({
      name: 'receivedAt',
      title: 'Received At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Which page/form the message came from (e.g. "contact-page").',
    }),
  ],
  // Newest messages first in the Studio list.
  orderings: [
    {
      title: 'Newest first',
      name: 'receivedAtDesc',
      by: [{ field: 'receivedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'subject', email: 'email' },
    prepare({ title, subtitle, email }) {
      return {
        title: title || email || 'Contact message',
        subtitle: subtitle || email,
      }
    },
  },
})

export default contactMessage
