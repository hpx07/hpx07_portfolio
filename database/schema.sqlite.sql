-- HPX.DEV v2 — SQLite schema (zero-config option, great for local dev)

CREATE TABLE IF NOT EXISTS settings (
  skey   TEXT NOT NULL PRIMARY KEY,
  svalue TEXT
);

CREATE TABLE IF NOT EXISTS posts (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  slug             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  excerpt          TEXT,
  content          TEXT,
  cover_image      TEXT,
  category         TEXT DEFAULT '',
  tags             TEXT,
  status           TEXT NOT NULL DEFAULT 'draft',
  featured         INTEGER NOT NULL DEFAULT 0,
  views            INTEGER NOT NULL DEFAULT 0,
  meta_title       TEXT DEFAULT '',
  meta_description TEXT,
  meta_keywords    TEXT DEFAULT '',
  og_image         TEXT DEFAULT '',
  published_at     TEXT,
  created_at       TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts (status, published_at);

CREATE TABLE IF NOT EXISTS projects (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  slug             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  category         TEXT DEFAULT '',
  description      TEXT,
  content          TEXT,
  image            TEXT,
  tech             TEXT,
  highlights       TEXT,
  live_url         TEXT DEFAULT '',
  repo_url         TEXT DEFAULT '',
  featured         INTEGER NOT NULL DEFAULT 0,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'published',
  meta_title       TEXT DEFAULT '',
  meta_description TEXT,
  created_at       TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status, sort_order);

CREATE TABLE IF NOT EXISTS plans (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  tagline     TEXT DEFAULT '',
  price       TEXT DEFAULT '',
  currency    TEXT DEFAULT '',
  period      TEXT DEFAULT '',
  features    TEXT,
  highlighted INTEGER NOT NULL DEFAULT 0,
  badge       TEXT DEFAULT '',
  cta_label   TEXT DEFAULT '',
  cta_link    TEXT DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  active      INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS skills (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  category   TEXT DEFAULT '',
  level      INTEGER NOT NULL DEFAULT 80,
  icon       TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active     INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS testimonials (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  author     TEXT NOT NULL,
  role       TEXT DEFAULT '',
  company    TEXT DEFAULT '',
  quote      TEXT,
  avatar     TEXT DEFAULT '',
  rating     INTEGER NOT NULL DEFAULT 5,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active     INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS faqs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  question   TEXT NOT NULL,
  answer     TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active     INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS social_links (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  label      TEXT NOT NULL,
  url        TEXT NOT NULL,
  icon       TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active     INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT DEFAULT '',
  body       TEXT,
  plan       TEXT DEFAULT '',
  is_read    INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS monitored_sites (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  url        TEXT NOT NULL,
  active     INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS health_checks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id     INTEGER NOT NULL,
  ok          INTEGER NOT NULL DEFAULT 0,
  status_code INTEGER DEFAULT 0,
  response_ms INTEGER DEFAULT 0,
  error       TEXT DEFAULT '',
  checked_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_health_site ON health_checks (site_id, checked_at);

CREATE TABLE IF NOT EXISTS page_views (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  path         TEXT NOT NULL,
  referrer     TEXT DEFAULT '',
  device       TEXT DEFAULT '',
  session_hash TEXT DEFAULT '',
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_views_created ON page_views (created_at);
CREATE INDEX IF NOT EXISTS idx_views_path    ON page_views (path);
