-- HPX.DEV v2 — PostgreSQL schema
-- Create the database first:  CREATE DATABASE hpx_v2;
-- (npm run db:init does all of this automatically)
-- Note: boolean-like flags are SMALLINT (0/1) so data ports 1:1 between MySQL and Postgres.

CREATE TABLE IF NOT EXISTS settings (
  skey   VARCHAR(191) NOT NULL PRIMARY KEY,
  svalue TEXT
);

CREATE TABLE IF NOT EXISTS posts (
  id               SERIAL PRIMARY KEY,
  slug             VARCHAR(191) NOT NULL UNIQUE,
  title            VARCHAR(255) NOT NULL,
  excerpt          TEXT,
  content          TEXT,
  cover_image      VARCHAR(512),
  category         VARCHAR(96) DEFAULT '',
  tags             TEXT,
  status           VARCHAR(24) NOT NULL DEFAULT 'draft',
  featured         SMALLINT NOT NULL DEFAULT 0,
  views            INTEGER NOT NULL DEFAULT 0,
  meta_title       VARCHAR(255) DEFAULT '',
  meta_description TEXT,
  meta_keywords    VARCHAR(512) DEFAULT '',
  og_image         VARCHAR(512) DEFAULT '',
  published_at     TIMESTAMP NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_posts_status   ON posts (status, published_at);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts (featured);

CREATE TABLE IF NOT EXISTS projects (
  id               SERIAL PRIMARY KEY,
  slug             VARCHAR(191) NOT NULL UNIQUE,
  title            VARCHAR(255) NOT NULL,
  category         VARCHAR(96) DEFAULT '',
  description      TEXT,
  content          TEXT,
  image            VARCHAR(512),
  tech             TEXT,
  highlights       TEXT,
  live_url         VARCHAR(512) DEFAULT '',
  repo_url         VARCHAR(512) DEFAULT '',
  featured         SMALLINT NOT NULL DEFAULT 0,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  status           VARCHAR(24) NOT NULL DEFAULT 'published',
  meta_title       VARCHAR(255) DEFAULT '',
  meta_description TEXT,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_projects_status   ON projects (status, sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects (featured);

CREATE TABLE IF NOT EXISTS plans (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(96) NOT NULL,
  tagline     VARCHAR(255) DEFAULT '',
  price       VARCHAR(48) DEFAULT '',
  currency    VARCHAR(8) DEFAULT '',
  period      VARCHAR(48) DEFAULT '',
  features    TEXT,
  highlighted SMALLINT NOT NULL DEFAULT 0,
  badge       VARCHAR(96) DEFAULT '',
  cta_label   VARCHAR(96) DEFAULT '',
  cta_link    VARCHAR(255) DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  active      SMALLINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS skills (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(96) NOT NULL,
  category   VARCHAR(96) DEFAULT '',
  level      INTEGER NOT NULL DEFAULT 80,
  icon       VARCHAR(96) DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active     SMALLINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS testimonials (
  id         SERIAL PRIMARY KEY,
  author     VARCHAR(191) NOT NULL,
  role       VARCHAR(191) DEFAULT '',
  company    VARCHAR(191) DEFAULT '',
  quote      TEXT,
  avatar     VARCHAR(512) DEFAULT '',
  rating     INTEGER NOT NULL DEFAULT 5,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active     SMALLINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS faqs (
  id         SERIAL PRIMARY KEY,
  question   VARCHAR(512) NOT NULL,
  answer     TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active     SMALLINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS social_links (
  id         SERIAL PRIMARY KEY,
  label      VARCHAR(96) NOT NULL,
  url        VARCHAR(512) NOT NULL,
  icon       VARCHAR(48) DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active     SMALLINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(191) NOT NULL,
  email      VARCHAR(191) NOT NULL,
  subject    VARCHAR(255) DEFAULT '',
  body       TEXT,
  plan       VARCHAR(96) DEFAULT '',
  is_read    SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages (created_at);

CREATE TABLE IF NOT EXISTS monitored_sites (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(191) NOT NULL,
  url        VARCHAR(512) NOT NULL,
  active     SMALLINT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS health_checks (
  id          SERIAL PRIMARY KEY,
  site_id     INTEGER NOT NULL,
  ok          SMALLINT NOT NULL DEFAULT 0,
  status_code INTEGER DEFAULT 0,
  response_ms INTEGER DEFAULT 0,
  error       VARCHAR(512) DEFAULT '',
  checked_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_health_site ON health_checks (site_id, checked_at);

CREATE TABLE IF NOT EXISTS page_views (
  id           SERIAL PRIMARY KEY,
  path         VARCHAR(255) NOT NULL,
  referrer     VARCHAR(255) DEFAULT '',
  device       VARCHAR(24) DEFAULT '',
  session_hash VARCHAR(64) DEFAULT '',
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_views_created ON page_views (created_at);
CREATE INDEX IF NOT EXISTS idx_views_path    ON page_views (path);
