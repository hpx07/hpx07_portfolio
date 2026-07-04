# HPX.DEV v2 — Portfolio, Blog & Agency Platform

The complete rebuild of hpx.dev: a fast, SEO-first portfolio + blog + agency site with a
full admin panel, first-party analytics, live-project health monitoring and a database
layer that speaks **MySQL, PostgreSQL and SQLite** interchangeably.

Built with Next.js 15 (App Router) · React 19 · zero CSS frameworks · "Ember & Ivory" design system.

---

## Quick start

```bash
cd hpx-v2
npm install
copy .env.example .env      # then edit — XAMPP MySQL defaults already work
npm run setup               # creates the database, tables and seed content
npm run dev                 # http://localhost:3000
```

Admin panel: **http://localhost:3000/admin** — credentials come from `.env`
(`ADMIN_USER` / `ADMIN_PASSWORD`). Change them and set a long random `AUTH_SECRET`
before deploying.

> No database yet? The public site still renders with built-in seed content.
> The admin panel needs a real database.

## Choosing a database

Set `DB_DIALECT` in `.env` to `mysql`, `postgres` or `sqlite`. Schemas live in
[database/](database/) — one file per dialect, identical shapes, so data ports 1:1.

### Data toolbelt

```bash
npm run db:init                                # create db + tables (current dialect)
npm run db:seed                                # seed default content (skips non-empty tables)
npm run db:export -- --format=json             # full JSON backup → database/exports/
npm run db:export -- --format=sql --target=postgres
npm run db:import -- --file=database/exports/backup.json --wipe
npm run db:migrate -- --from=mysql --to=postgres   # full cross-database migration
```

The same export/import lives in **Admin → Settings → Data** as one-click downloads.

## What's inside

**Public site** — modular sections, each toggleable from the admin:
- Home: hero with the colorful SplashCursor fluid sim, reversible parallax reveal
  (scroll down reveals, scroll up un-reveals), stats, featured projects, tech ledger,
  process, plans, testimonials, blog preview, FAQ, contact
- `/projects` + per-project case-study pages
- `/blog` + article pages — Markdown, reading progress, view counts, tags, related posts
- `/plans` — agency pricing tiers
- `/contact` — stored to the database inbox
- `Ctrl/⌘+K` command palette with live search across pages, projects and articles

**SEO** — server-rendered everything, per-post/per-project meta fields, Open Graph +
Twitter cards, JSON-LD (Organization, BlogPosting, Breadcrumbs), dynamic `sitemap.xml`,
`robots.txt`, RSS at `/feed.xml`, canonical URLs, Google site verification, GTM + GA4 +
arbitrary custom pixels — all editable in the admin.

**Admin panel** (`/admin`)
- Dashboard: content counts, traffic, unread inbox, live-project health snapshot
- Full CRUD: posts, projects, plans, skills, testimonials, FAQs, social links
- Logo & favicon upload, section/page enable-disable switches
- **Project health**: add any live URL → uptime checks, response times, uptime strips,
  plus Google PageSpeed audits (performance / SEO / accessibility / best-practices)
- **Analytics & tags**: first-party cookie-less analytics (views, visitors, top pages,
  referrers, devices) + GTM/GA4/custom tag manager
- Data export (JSON / MySQL SQL / PostgreSQL SQL) and JSON import

**Performance** — ISR caching (60 s revalidate) on all public pages, indexed +
paginated queries (stays fast with thousands of posts), the WebGL fluid sim loads only
on capable desktop devices after idle, no CSS/JS frameworks beyond React itself.

## Project layout

```
hpx-v2/
├─ database/            schema.mysql.sql · schema.postgres.sql · schema.sqlite.sql
├─ scripts/db.mjs       init / seed / export / import / migrate CLI
├─ middleware.js        admin session guard
└─ src/
   ├─ lib/              db adapter · repos (data access) · auth · seo · defaults (seed)
   ├─ components/       public UI + admin UI (ResourceManager powers every CRUD screen)
   └─ app/
      ├─ (site)/        home, projects, blog, plans, contact
      ├─ admin/         login + (panel)/ dashboard, content, monitor, analytics, settings
      └─ api/           track, contact, search, admin CRUD/upload/data/monitor
```

## Deploying

Any Node host works (`npm run build && npm start`). Set `SITE_URL` to the public URL so
sitemap/OG/RSS links are correct. For uptime history you can hit
`POST /api/admin/monitor/check` from a cron (authenticate with the session cookie, or
run checks from the admin UI).
