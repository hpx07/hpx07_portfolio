-- HPX.DEV v2 — MySQL / MariaDB schema
-- Create the database first:  CREATE DATABASE hpx_v2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- (npm run db:init does all of this automatically)

CREATE TABLE IF NOT EXISTS settings (
  skey   VARCHAR(191) NOT NULL PRIMARY KEY,
  svalue LONGTEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS posts (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug             VARCHAR(191) NOT NULL UNIQUE,
  title            VARCHAR(255) NOT NULL,
  excerpt          TEXT,
  content          LONGTEXT,
  cover_image      VARCHAR(512),
  category         VARCHAR(96) DEFAULT '',
  tags             TEXT,
  status           VARCHAR(24) NOT NULL DEFAULT 'draft',
  featured         SMALLINT NOT NULL DEFAULT 0,
  views            INT UNSIGNED NOT NULL DEFAULT 0,
  meta_title       VARCHAR(255) DEFAULT '',
  meta_description TEXT,
  meta_keywords    VARCHAR(512) DEFAULT '',
  og_image         VARCHAR(512) DEFAULT '',
  published_at     DATETIME NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_posts_status (status, published_at),
  INDEX idx_posts_featured (featured),
  FULLTEXT KEY ft_posts (title, excerpt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug             VARCHAR(191) NOT NULL UNIQUE,
  title            VARCHAR(255) NOT NULL,
  category         VARCHAR(96) DEFAULT '',
  description      TEXT,
  content          LONGTEXT,
  image            VARCHAR(512),
  tech             TEXT,
  highlights       TEXT,
  live_url         VARCHAR(512) DEFAULT '',
  repo_url         VARCHAR(512) DEFAULT '',
  featured         SMALLINT NOT NULL DEFAULT 0,
  sort_order       INT NOT NULL DEFAULT 0,
  status           VARCHAR(24) NOT NULL DEFAULT 'published',
  meta_title       VARCHAR(255) DEFAULT '',
  meta_description TEXT,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_projects_status (status, sort_order),
  INDEX idx_projects_featured (featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS plans (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
  sort_order  INT NOT NULL DEFAULT 0,
  active      SMALLINT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS skills (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(96) NOT NULL,
  category   VARCHAR(96) DEFAULT '',
  level      INT NOT NULL DEFAULT 80,
  icon       VARCHAR(96) DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  active     SMALLINT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS testimonials (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  author     VARCHAR(191) NOT NULL,
  role       VARCHAR(191) DEFAULT '',
  company    VARCHAR(191) DEFAULT '',
  quote      TEXT,
  avatar     VARCHAR(512) DEFAULT '',
  rating     INT NOT NULL DEFAULT 5,
  sort_order INT NOT NULL DEFAULT 0,
  active     SMALLINT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS faqs (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  question   VARCHAR(512) NOT NULL,
  answer     TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  active     SMALLINT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS social_links (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  label      VARCHAR(96) NOT NULL,
  url        VARCHAR(512) NOT NULL,
  icon       VARCHAR(48) DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  active     SMALLINT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS messages (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(191) NOT NULL,
  email      VARCHAR(191) NOT NULL,
  subject    VARCHAR(255) DEFAULT '',
  body       TEXT,
  plan       VARCHAR(96) DEFAULT '',
  is_read    SMALLINT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_messages_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS monitored_sites (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(191) NOT NULL,
  url        VARCHAR(512) NOT NULL,
  active     SMALLINT NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS health_checks (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  site_id     INT UNSIGNED NOT NULL,
  ok          SMALLINT NOT NULL DEFAULT 0,
  status_code INT DEFAULT 0,
  response_ms INT DEFAULT 0,
  error       VARCHAR(512) DEFAULT '',
  checked_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_health_site (site_id, checked_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS page_views (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  path         VARCHAR(255) NOT NULL,
  referrer     VARCHAR(255) DEFAULT '',
  device       VARCHAR(24) DEFAULT '',
  session_hash VARCHAR(64) DEFAULT '',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_views_created (created_at),
  INDEX idx_views_path (path)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
