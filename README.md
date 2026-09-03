# Coinscribed

Your Trusted Source for Financial Intelligence. Coinscribed provides financial calculators, crypto and market news, US bank routing numbers, and personal finance tools to help you make informed decisions.

## Features

- **Financial Calculators** - Mortgage, 401(k), EMI, SIP, Loan Payoff, Compound Interest, and Retirement calculators
- **Crypto & Finance News** - Powered by Sanity CMS with categories for Crypto, Economy, Markets, and Banking
- **US Bank Routing Numbers** - Searchable database of routing numbers for major US banks
- **SEO Optimized** - JSON-LD schema markup, sitemap, robots.txt, Open Graph tags
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Mobile-first, accessible, and fast

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Sanity CMS](https://www.sanity.io/) - Headless CMS for news content
- [next-themes](https://github.com/pacocoursey/next-themes) - Dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: Node.js 20 LTS)
- npm 9+

### Installation

1. Clone the repository:

```bash
git clone https://github.com/varunattri3245/coinscribed.git
cd coinscribed
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
coinscribed/
app/                    # Next.js App Router pages
  layout.tsx            # Root layout (fonts, metadata, theme)
  page.tsx              # Homepage
  globals.css           # Global styles with Tailwind
  robots.ts             # robots.txt generation
  calculators/          # Financial calculator pages
  news/                 # News section
    page.tsx            # News listing with category tabs
    [slug]/             # Individual article pages
    category/           # Category-filtered listings
  privacy-policy/       # Privacy Policy page
  terms-of-service/     # Terms of Service page
  disclaimer/           # Disclaimer page
components/             # Reusable React components
  Header.tsx            # Site header with navigation
  Footer.tsx            # Site footer with link columns
  ThemeProvider.tsx      # Dark mode theme provider
  news/                 # News-specific components
    ArticleCard.tsx         # Article preview card
    CategoryBadge.tsx       # Category tag/badge
    PortableTextRenderer.tsx # Sanity rich text renderer
config/
  site.ts               # Site-wide configuration
lib/
  schema-markup.ts      # JSON-LD structured data helpers
  sanity.ts             # Sanity client configuration
  sanity-queries.ts     # GROQ queries for fetching content
sanity/                 # Sanity CMS schema definitions
  schema-index.ts       # All schemas exported together
  schemas/
    article.ts          # Article document type
    author.ts           # Author document type
    category.ts         # Category document type
public/                 # Static assets
tailwind.config.ts      # Tailwind CSS configuration
tsconfig.json           # TypeScript configuration
next.config.js          # Next.js configuration
postcss.config.js       # PostCSS configuration
```

## Configuration

All site-wide settings are managed in `config/site.ts`:

- **Brand name and tagline** - Update `name` and `tagline`
- **Site URL** - Update `url` for production
- **Navigation items** - Modify the `nav` array
- **Footer links** - Modify the `footer` object
- **Social links** - Update `social` with your profiles
- **SEO keywords** - Update the `keywords` array

## Content Management

### News Articles (via Sanity CMS — built-in admin at `/studio`)

News content is managed through [Sanity CMS](https://www.sanity.io/). The editing
tool (Sanity Studio) is **embedded directly in this site**, so writers and editors
manage everything from your own domain at **`/studio`**
(e.g. `https://coinscribed.com/studio` or, before the custom domain is connected,
`https://coinscribed-iota.vercel.app/studio`).

The Sanity project is already wired up:

- **Project ID:** `h0xv92n1`
- **Dataset:** `production`

#### One-time setup (already done in code)

The following are already configured in this repo — no action needed unless you
change projects:

- `sanity.config.ts` — Studio config (schemas, structure tool, Vision GROQ tool)
- `app/studio/[[...tool]]/page.tsx` — serves the embedded Studio at `/studio`
- `.env.local` — contains `NEXT_PUBLIC_SANITY_PROJECT_ID` + `NEXT_PUBLIC_SANITY_DATASET`
- Content schemas in `sanity/schemas/` (article, author, category)

#### What YOU need to do once (in the Sanity dashboard)

1. **Set environment variables on Vercel**
   - Vercel → Project → Settings → Environment Variables, add:
     ```env
     NEXT_PUBLIC_SANITY_PROJECT_ID=h0xv92n1
     NEXT_PUBLIC_SANITY_DATASET=production
     ```
   - Redeploy so `/studio` and live content work in production.

2. **Add CORS origins** (so the site can read/write content)
   - Go to [manage.sanity.io](https://manage.sanity.io) → your project → **API → CORS Origins**
   - Add each of these with **"Allow credentials" checked**:
     - `http://localhost:3000` (local development)
     - `https://coinscribed-iota.vercel.app` (current Vercel URL)
     - `https://coinscribed.com` (once the custom domain is connected)

3. **Invite your writers and editors**
   - manage.sanity.io → your project → **Members → Invite members**
   - Give writers the **Editor** role and yourself **Administrator**.
   - They'll get an email invite and can then log in at `/studio`.

#### Daily editor workflow (log in at `/studio`)

1. Go to **`yourdomain.com/studio`** and sign in with your Sanity account.
2. **First time only:** create the four **Category** documents — Crypto, Economy,
   Markets, Banking (slug auto-fills from the title).
3. **First time only:** create at least one **Author** (name, bio, photo).
4. Create an **Article**:
   - **Title** — the slug (URL) auto-generates from it; you can edit it.
   - **Excerpt** — short summary (used on cards and as the meta description).
   - **Body** — rich text: headings, bold/italic, links, quotes, inline images.
   - **Featured Image** — upload/crop; add alt text for SEO + accessibility.
   - **Author** and **Category** — pick from the dropdowns.
   - **Published At** — set the date/time.
   - **SEO Title / SEO Description** — optional overrides for Google.
5. Click **Publish**. Within seconds the article appears on `/news`, the homepage,
   its category page, and its own `/news/<slug>` page, with SEO tags + Article
   schema (JSON-LD) generated automatically.

#### Content structure

| Content Type | Fields | Purpose |
|---|---|---|
| **Article** | Title, slug, excerpt, body (rich text + inline images), author, category, featured image, Published At, SEO title, SEO description | News articles |
| **Category** | Title, slug, description | Organize articles (Crypto, Economy, Markets, Banking) |
| **Author** | Name, slug, bio, image | Article attribution + byline avatar |

#### How it works before any content is published

The site builds and runs even with an empty Sanity dataset. Until real articles
are published, the news sections show built-in **sample articles** (from
`data/sample-news.ts`) so the site never looks empty. As soon as you publish real
articles in `/studio`, they automatically replace the samples — no code change,
no redeploy needed. Calculators, bank routing numbers, and legal pages are
unaffected either way.

### Custom Admin Editor (via `/admin`)

Alongside Sanity Studio, this site ships a second, WordPress-style editor at
**`/admin`**. It is completely **additive**: Sanity Studio at `/studio` still
works exactly as before, and both tools read and write the **same Sanity
dataset**, so an article created in one is fully editable in the other. Use
whichever you prefer.

Why it exists: building tables in Studio was awkward, so `/admin` includes an
easy, **spreadsheet-style table creator** (add and remove rows and columns,
type into each cell, set an optional caption). Tables built here save into the
exact same format Studio uses, so they render identically on the public site
and stay editable in `/studio`.

**Authentication** uses each writer's own Sanity account (the same login as
Studio). It is real multi-user auth with per-user roles managed in
[manage.sanity.io](https://manage.sanity.io). Every save, publish, and image
upload runs **as the logged-in Sanity user**, so per-user roles and the audit
trail apply. There is **no shared password and no master/server write token**
anywhere in this project, and none should ever be added.

**How the login flow works:** clicking "Sign in with Sanity" redirects to
Sanity's hosted login with `?type=token`. After the user authenticates, Sanity
redirects back to `/admin` with a **per-user session token** in the `sid`
query parameter. The app captures that token, holds it in memory (mirrored to
`sessionStorage` so a page reload keeps the session), and attaches it to every
Sanity API request via `client.withConfig({ token })`. This token is scoped to
the signed-in user's identity and roles; it is NOT a master or project token.
The `withCredentials: true` cookie path is kept as a secondary fallback, but
the primary mechanism is the captured per-user token, which avoids cross-site
third-party cookie issues entirely.

#### What YOU need to do once (in the Sanity dashboard)

The `/admin` editor writes to Sanity from the browser as the logged-in user, so
a couple of dashboard settings must be in place. Most of these overlap with the
Studio setup above.

1. **Allow credentialed writes in CORS**
   - Go to [manage.sanity.io](https://manage.sanity.io) → your project → **API → CORS Origins**.
   - Make sure each of these origins has **"Allow credentials" CHECKED**:
     - `http://localhost:3000` (local development)
     - `https://coinscribed-iota.vercel.app` (current Vercel URL)
     - `https://coinscribed.com` (once the custom domain is connected)
   - "Allow credentials" is what lets the browser send the writer's Sanity
     session for **writes and image uploads**, not just reads. Without it,
     saving or uploading from `/admin` will fail with a permission or CORS error.

2. **Invite your writers with the right role**
   - manage.sanity.io → your project → **Members → Invite members**.
   - Give writers the **Editor** role, and yourself (owners) **Administrator**.
   - Because writes run as the logged-in user, each person's role and the audit
     trail apply automatically. No separate `/admin` user list to maintain.

3. **Confirm the environment variables are set**
   - Locally in `.env.local` and on Vercel (Project → Settings → Environment
     Variables), confirm both are present:
     ```env
     NEXT_PUBLIC_SANITY_PROJECT_ID=h0xv92n1
     NEXT_PUBLIC_SANITY_DATASET=production
     ```
   - The `/admin` editor reuses these same two public values. **No new
     environment variables are required**, and no secret token is used.

#### Daily authoring workflow (log in at `/admin`)

1. Go to **`yourdomain.com/admin`** and **sign in with your Sanity account**
   (unauthenticated visitors are sent to Sanity's hosted login and returned to
   `/admin`).
2. You land on the **article list**, showing published articles and drafts with
   a status badge. Click **New Article**, or **Edit** on an existing one.
3. Fill in the fields: **Title** (the slug auto-generates and stays editable),
   **Excerpt** (up to 300 characters), **Author** and **Category** pickers,
   **Published At**, and optional **SEO Title** (up to 70) and **SEO
   Description** (up to 160). Add **FAQs** as needed.
4. Build the **Body** with the rich-text toolbar: headings (H2 to H4), quote,
   bold, italic, underline, inline code, links, and bullet or numbered lists.
5. **Insert a table** with the spreadsheet-style editor: add and remove rows and
   columns, type directly into each cell, reorder rows and columns, and set an
   optional caption.
6. **Upload images** for the featured image and inline in the body (with alt
   text, plus a caption for inline images). Uploads go to Sanity as the
   logged-in user.
7. Click **Save Draft** to keep working, or **Publish** when ready. Publishing
   uses the same draft-and-publish model as Studio, so documents stay
   interchangeable between `/admin` and `/studio`.
8. Published articles appear on the public site (`/news`, the homepage, the
   category page, and `/news/<slug>`) within the existing cache window, exactly
   the same as Studio-published content.

### Site Configuration

Non-technical team members can update site settings by editing `config/site.ts`:

- Navigation links
- Footer content
- Social media URLs
- SEO metadata

### Legal Pages

Legal pages (Privacy Policy, Terms of Service, Disclaimer) are located in their respective directories under `app/`. Edit the TSX files directly to update legal content.

## Design System

| Color | Hex | Usage |
|-------|-----|-------|
| White | #ffffff | Main background |
| Off-white | #fafafa | Section backgrounds |
| Light gray | #f4f4f5 | Cards and boxes |
| Near-black | #18181b | Headlines |
| Dark gray | #3f3f46 | Body text |
| Medium gray | #71717a | Secondary text |
| Light gray text | #a1a1aa | Captions |
| Charcoal | #27272a | Footer, dark sections |
| Zinc | #52525b | Links, buttons |
| Border gray | #e4e4e7 | Dividers, borders |

### Typography

- **Headlines**: Playfair Display (serif) - gives a newspaper/editorial feel
- **Body text**: Inter (sans-serif) - clean and highly readable

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Deployment

This project is optimized for [Vercel](https://vercel.com/):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect Next.js and configure the build
4. Set environment variables for Sanity CMS connection

### Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

## SEO

The site includes comprehensive SEO support:

- **Metadata API** - Title, description, and Open Graph tags on every page
- **JSON-LD Schema** - Organization, WebSite, Article, FAQ, HowTo, and BreadcrumbList schemas
- **Sitemap** - Generated at /sitemap.xml via the native Next.js `app/sitemap.ts`
- **robots.txt** - Configured via Next.js Metadata API
- **Semantic HTML** - Proper heading hierarchy and ARIA labels

## License

All rights reserved. Copyright Coinscribed.
