# Studio Website (Next.js + Tailwind + Aiven MySQL)

A full responsive studio website with an admin dashboard to manage logo, hero content, movie/character cards, and social links.

## Features

- Responsive public website:
  - Header with logo + studio name + hamburger menu
  - Slide-out menu with search, nav links, and admin login
  - Hero banner with editable background image and text
  - Characters/Movies card grid
  - Footer with editable logo area and social links
- Admin panel:
  - Password login (cookie session)
  - Upload logo and hero image
  - Edit hero title/subtitle
  - Card CRUD (add, edit, delete, reorder)
  - Edit social links
- Data layer:
  - Aiven MySQL database (site content + cards)
  - Image uploads stored in `public/uploads`
  - API routes for CRUD + upload + auth

## Tech Stack

- Next.js (App Router)
- Node.js
- Tailwind CSS
- MySQL (Aiven)

## Project Structure

- `app/page.tsx` - public homepage
- `app/admin/login/page.tsx` - admin login
- `app/admin/page.tsx` - admin dashboard
- `app/api/*` - auth/content/cards/upload API routes
- `components/*` - modular UI components
- `components/admin/AdminDashboard.tsx` - admin management UI
- `lib/content-store.ts` - MySQL read/write helpers
- `lib/db.ts` - DB pool config
- `lib/auth.ts` - password + session helpers
- `db/schema.sql` - MySQL schema
- `scripts/db-init.mjs` - initialize + seed DB from sample JSON
- `data/content.json` - sample seed content
- `public/uploads/*` - uploaded images + sample placeholders

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env.local
```

3. Update `.env.local` values:

- `ADMIN_PASSWORD` - admin login password
- `ADMIN_SESSION_TOKEN` - random secret string for cookie validation
- `DATABASE_URL` - Aiven MySQL connection URL
- `DB_SSL` - keep `true` for Aiven (set `false` only for local non-SSL MySQL)

4. Initialize database schema + seed:

```bash
npm run db:init
```

5. Start development server:

```bash
npm run dev
```

6. Open:

- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

## Admin Usage

- Login with the password from `.env.local`
- Use dashboard sections to manage branding, hero, cards, and links
- Uploaded files are saved under `public/uploads`
- Content updates are persisted in Aiven MySQL

## Production

```bash
npm run build
npm run start
```

Set secure production values for `ADMIN_PASSWORD`, `ADMIN_SESSION_TOKEN`, and `DATABASE_URL` before deployment.
