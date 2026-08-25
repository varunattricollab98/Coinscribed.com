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
- [next-sitemap](https://github.com/iamvishnusankar/next-sitemap) - Sitemap generation

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
next-sitemap.config.js  # Sitemap generation config
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

### News Articles (via Sanity CMS)

News content is managed through [Sanity CMS](https://www.sanity.io/), a headless content management system. This allows editors to create, edit, and publish articles without touching code.

#### Setting Up Sanity (Step-by-Step)

1. **Create a free Sanity account**
   - Go to [sanity.io](https://www.sanity.io/) and sign up (free tier available)
   - After signing up, you will see your Sanity dashboard

2. **Create a new Sanity project**
   - In the Sanity dashboard, click "Create new project"
   - Give it a name (e.g., "Coinscribed News")
   - Choose the "production" dataset (this is the default)
   - Note your **Project ID** (a short alphanumeric string like `abc123de`)

3. **Set up Sanity Studio** (the editing interface)
   - Initialize a separate Sanity Studio project:
     ```bash
     npm create sanity@latest -- --project YOUR_PROJECT_ID --dataset production
     ```
   - When prompted, choose a template (start with "Clean project")
   - Copy the schema files from `sanity/schemas/` in this repo to your Studio project
   - Import schemas in your Studio's `schemaTypes/index.ts`:
     ```typescript
     import article from './article'
     import author from './author'
     import category from './category'

     export const schemaTypes = [article, author, category]
     ```
   - Deploy your Studio: `npx sanity deploy` (gives you a hosted URL like `your-studio.sanity.studio`)

4. **Configure environment variables**
   - Create a `.env.local` file in the root of this project:
     ```env
     NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
     NEXT_PUBLIC_SANITY_DATASET=production
     ```
   - On Vercel: add these same variables in Project Settings > Environment Variables

5. **Set up CORS for your domain**
   - In the Sanity dashboard, go to Settings > API > CORS Origins
   - Add `http://localhost:3000` for local development
   - Add your production domain (e.g., `https://coinscribed.com`)

6. **Create initial content**
   - Open your deployed Sanity Studio
   - First, create Categories: Crypto, Economy, Markets, Banking
   - Then create at least one Author
   - Finally, create Articles referencing the categories and authors

#### Content Structure

| Content Type | Fields | Purpose |
|---|---|---|
| **Article** | Title, slug, excerpt, body (rich text), author, category, image, SEO fields | News articles and blog posts |
| **Category** | Title, slug, description | Organize articles (Crypto, Economy, Markets, Banking) |
| **Author** | Name, slug, bio, image | Article attribution |

#### Managing Articles

Once Sanity Studio is set up, content editors can:

- **Write articles** using the rich text editor (supports headings, links, images, quotes)
- **Upload images** directly in the editor
- **Schedule publishing** by setting the "Published At" date
- **Categorize content** by selecting a category
- **Optimize SEO** by filling in SEO title and description fields

#### How It Works Without Sanity

The site builds and deploys without Sanity credentials. When `NEXT_PUBLIC_SANITY_PROJECT_ID` is not set:
- News pages show a placeholder message indicating content is managed via CMS
- All other site features (calculators, bank routing numbers, legal pages) work normally
- No errors occur during build or at runtime

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
- **Sitemap** - Auto-generated sitemap.xml via next-sitemap
- **robots.txt** - Configured via Next.js Metadata API
- **Semantic HTML** - Proper heading hierarchy and ARIA labels

## License

All rights reserved. Copyright Coinscribed.
