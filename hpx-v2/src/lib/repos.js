// Data access layer. Every public read falls back to seed content when the
// database is unreachable, so the site always renders.

import { cache } from 'react'
import { q, run, sqlDate, upsertSetting } from '@/lib/db'
import { parseJson, slugify } from '@/lib/utils'
import {
  DEFAULT_SETTINGS,
  SEED_PROJECTS,
  SEED_POSTS,
  SEED_PLANS,
  SEED_SKILLS,
  SEED_TESTIMONIALS,
  SEED_FAQS,
  SEED_SOCIALS,
} from '@/lib/defaults.mjs'

const JSON_SETTING_KEYS = ['pages', 'sections', 'seo', 'stats', 'process']

// ── settings ─────────────────────────────────────────────────
export const getSettings = cache(async () => {
  try {
    const rows = await q('SELECT skey, svalue FROM settings')
    const stored = {}
    for (const row of rows) {
      if (JSON_SETTING_KEYS.includes(row.skey)) {
        const parsed = parseJson(row.svalue, null)
        if (Array.isArray(parsed)) {
          stored[row.skey] = parsed
        } else if (parsed && typeof parsed === 'object') {
          stored[row.skey] = { ...DEFAULT_SETTINGS[row.skey], ...parsed }
        } else {
          stored[row.skey] = DEFAULT_SETTINGS[row.skey]
        }
      } else {
        stored[row.skey] = row.svalue
      }
    }
    return { ...DEFAULT_SETTINGS, ...stored, _db: true }
  } catch {
    return { ...DEFAULT_SETTINGS, _db: false }
  }
})

export async function saveSettings(patch) {
  for (const [key, value] of Object.entries(patch)) {
    if (!(key in DEFAULT_SETTINGS)) continue
    const stored = typeof value === 'string' ? value : JSON.stringify(value)
    await upsertSetting(key, stored)
  }
}

// ── shaping ──────────────────────────────────────────────────
function shapePost(row) {
  return { ...row, tags: parseJson(row.tags, []) }
}
function shapeProject(row) {
  return { ...row, tech: parseJson(row.tech, []), highlights: parseJson(row.highlights, []) }
}
function shapePlan(row) {
  return { ...row, features: parseJson(row.features, []) }
}

// ── posts ────────────────────────────────────────────────────
export async function listPosts({ page = 1, perPage = 9, search = '', tag = '', featuredOnly = false } = {}) {
  try {
    const where = ["status = 'published'"]
    const params = []
    if (search) {
      where.push('(title LIKE ? OR excerpt LIKE ?)')
      params.push(`%${search}%`, `%${search}%`)
    }
    if (tag) {
      where.push('tags LIKE ?')
      params.push(`%"${tag}"%`)
    }
    if (featuredOnly) where.push('featured = 1')
    const whereSql = `WHERE ${where.join(' AND ')}`

    const totalRow = await q(`SELECT COUNT(*) AS c FROM posts ${whereSql}`, params)
    const total = Number(totalRow[0].c)
    const offset = (Math.max(1, page) - 1) * perPage
    const rows = await q(
      `SELECT id, slug, title, excerpt, cover_image, category, tags, featured, views, published_at, created_at
       FROM posts ${whereSql} ORDER BY published_at DESC, id DESC LIMIT ${Number(perPage)} OFFSET ${Number(offset)}`,
      params,
    )
    return { posts: rows.map(shapePost), total, pages: Math.max(1, Math.ceil(total / perPage)) }
  } catch {
    const posts = SEED_POSTS.map((p, i) => shapePost({ id: i + 1, views: 0, published_at: null, ...p }))
    return { posts: featuredOnly ? posts.filter((p) => p.featured) : posts, total: posts.length, pages: 1 }
  }
}

export async function getPostBySlug(slug) {
  try {
    const rows = await q("SELECT * FROM posts WHERE slug = ? AND status = 'published' LIMIT 1", [slug])
    return rows[0] ? shapePost(rows[0]) : null
  } catch {
    const hit = SEED_POSTS.find((p) => p.slug === slug)
    return hit ? shapePost({ id: 0, views: 0, published_at: null, ...hit }) : null
  }
}

export function incrementViews(table, id) {
  if (!id) return
  if (table !== 'posts' && table !== 'projects') return
  run(`UPDATE ${table} SET views = views + 1 WHERE id = ?`, [id]).catch(() => {})
}

// ── projects ─────────────────────────────────────────────────
export async function listProjects({ featuredOnly = false, limit = 0 } = {}) {
  try {
    const where = featuredOnly ? "WHERE status = 'published' AND featured = 1" : "WHERE status = 'published'"
    const limitSql = limit ? ` LIMIT ${Number(limit)}` : ''
    const rows = await q(
      `SELECT * FROM projects ${where} ORDER BY sort_order ASC, id ASC${limitSql}`,
    )
    return rows.map(shapeProject)
  } catch {
    let list = SEED_PROJECTS.map((p, i) => shapeProject({ id: i + 1, status: 'published', ...p }))
    if (featuredOnly) list = list.filter((p) => p.featured)
    return limit ? list.slice(0, limit) : list
  }
}

export async function getProjectBySlug(slug) {
  try {
    const rows = await q("SELECT * FROM projects WHERE slug = ? AND status = 'published' LIMIT 1", [slug])
    return rows[0] ? shapeProject(rows[0]) : null
  } catch {
    const hit = SEED_PROJECTS.find((p) => p.slug === slug)
    return hit ? shapeProject({ id: 0, status: 'published', ...hit }) : null
  }
}

// ── simple lists ─────────────────────────────────────────────
async function listActive(table, seed, shape = (r) => r) {
  try {
    const rows = await q(`SELECT * FROM ${table} WHERE active = 1 ORDER BY sort_order ASC, id ASC`)
    return rows.map(shape)
  } catch {
    return seed.map((r, i) => shape({ id: i + 1, ...r }))
  }
}

export const listPlans = () => listActive('plans', SEED_PLANS, shapePlan)
export const listSkills = () => listActive('skills', SEED_SKILLS)
export const listTestimonials = () => listActive('testimonials', SEED_TESTIMONIALS)
export const listFaqs = () => listActive('faqs', SEED_FAQS)
export const listSocials = () => listActive('social_links', SEED_SOCIALS)

// ── messages ─────────────────────────────────────────────────
export async function createMessage({ name, email, subject = '', body = '', plan = '' }) {
  await run(
    'INSERT INTO messages (name, email, subject, body, plan) VALUES (?, ?, ?, ?, ?)',
    [name, email, subject, body, plan],
  )
}

// ── analytics ────────────────────────────────────────────────
export async function trackView({ path, referrer = '', device = '', session_hash = '' }) {
  await run(
    'INSERT INTO page_views (path, referrer, device, session_hash) VALUES (?, ?, ?, ?)',
    [String(path).slice(0, 255), String(referrer).slice(0, 255), device, session_hash],
  )
}

export async function getAnalytics(days = 30) {
  const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10) + ' 00:00:00'
  const d = sqlDate('created_at')
  const [byDay, topPages, referrers, devices, totals] = await Promise.all([
    q(
      `SELECT ${d} AS day, COUNT(*) AS views, COUNT(DISTINCT session_hash) AS visitors
       FROM page_views WHERE created_at >= ? GROUP BY ${d} ORDER BY day ASC`,
      [cutoff],
    ),
    q(
      `SELECT path, COUNT(*) AS views FROM page_views WHERE created_at >= ?
       GROUP BY path ORDER BY views DESC LIMIT 12`,
      [cutoff],
    ),
    q(
      `SELECT referrer, COUNT(*) AS views FROM page_views WHERE created_at >= ? AND referrer <> ''
       GROUP BY referrer ORDER BY views DESC LIMIT 10`,
      [cutoff],
    ),
    q(
      `SELECT device, COUNT(*) AS views FROM page_views WHERE created_at >= ?
       GROUP BY device ORDER BY views DESC`,
      [cutoff],
    ),
    q(
      `SELECT COUNT(*) AS views, COUNT(DISTINCT session_hash) AS visitors
       FROM page_views WHERE created_at >= ?`,
      [cutoff],
    ),
  ])
  return {
    byDay: byDay.map((r) => ({ day: String(r.day).slice(0, 10), views: Number(r.views), visitors: Number(r.visitors) })),
    topPages,
    referrers,
    devices,
    totals: { views: Number(totals[0]?.views || 0), visitors: Number(totals[0]?.visitors || 0) },
  }
}

// ── project health monitoring ────────────────────────────────
export async function runHealthChecks() {
  const sites = await q('SELECT * FROM monitored_sites WHERE active = 1')
  const results = []
  await Promise.all(
    sites.map(async (site) => {
      const started = Date.now()
      let ok = 0
      let statusCode = 0
      let error = ''
      try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 12000)
        const res = await fetch(site.url, {
          redirect: 'follow',
          signal: controller.signal,
          headers: { 'user-agent': 'HPX-Monitor/2.0' },
          cache: 'no-store',
        })
        clearTimeout(timer)
        statusCode = res.status
        ok = res.ok ? 1 : 0
        if (!res.ok) error = `HTTP ${res.status}`
      } catch (err) {
        error = String(err?.message || 'fetch failed').slice(0, 500)
      }
      const responseMs = Date.now() - started
      await run(
        'INSERT INTO health_checks (site_id, ok, status_code, response_ms, error) VALUES (?, ?, ?, ?, ?)',
        [site.id, ok, statusCode, responseMs, error],
      )
      results.push({ site_id: site.id, name: site.name, url: site.url, ok, statusCode, responseMs, error })
    }),
  )
  return results
}

export async function getMonitorSummary() {
  const sites = await q('SELECT * FROM monitored_sites ORDER BY id ASC')
  const cutoff = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 19).replace('T', ' ')
  const summary = []
  for (const site of sites) {
    const recent = await q(
      'SELECT ok, status_code, response_ms, error, checked_at FROM health_checks WHERE site_id = ? AND checked_at >= ? ORDER BY checked_at DESC LIMIT 50',
      [site.id, cutoff],
    )
    const latest = recent[0] || null
    const uptime = recent.length
      ? Math.round((recent.filter((r) => Number(r.ok) === 1).length / recent.length) * 1000) / 10
      : null
    const avgMs = recent.length
      ? Math.round(recent.reduce((sum, r) => sum + Number(r.response_ms || 0), 0) / recent.length)
      : null
    summary.push({ ...site, latest, uptime, avgMs, history: recent.slice(0, 24).reverse() })
  }
  return summary
}

// ── generic admin CRUD registry ──────────────────────────────
export const RESOURCES = {
  posts: {
    table: 'posts',
    orderBy: 'created_at DESC',
    searchCols: ['title', 'slug'],
    fields: ['slug', 'title', 'excerpt', 'content', 'cover_image', 'category', 'tags', 'status', 'featured', 'meta_title', 'meta_description', 'meta_keywords', 'og_image', 'published_at'],
    jsonFields: ['tags'],
    slugFrom: 'title',
    touchUpdated: true,
  },
  projects: {
    table: 'projects',
    orderBy: 'sort_order ASC, id ASC',
    searchCols: ['title', 'slug'],
    fields: ['slug', 'title', 'category', 'description', 'content', 'image', 'tech', 'highlights', 'live_url', 'repo_url', 'featured', 'sort_order', 'status', 'meta_title', 'meta_description'],
    jsonFields: ['tech', 'highlights'],
    slugFrom: 'title',
    touchUpdated: true,
  },
  plans: {
    table: 'plans',
    orderBy: 'sort_order ASC, id ASC',
    searchCols: ['name'],
    fields: ['name', 'tagline', 'price', 'currency', 'period', 'features', 'highlighted', 'badge', 'cta_label', 'cta_link', 'sort_order', 'active'],
    jsonFields: ['features'],
  },
  skills: {
    table: 'skills',
    orderBy: 'sort_order ASC, id ASC',
    searchCols: ['name', 'category'],
    fields: ['name', 'category', 'level', 'icon', 'sort_order', 'active'],
  },
  testimonials: {
    table: 'testimonials',
    orderBy: 'sort_order ASC, id ASC',
    searchCols: ['author', 'company'],
    fields: ['author', 'role', 'company', 'quote', 'avatar', 'rating', 'sort_order', 'active'],
  },
  faqs: {
    table: 'faqs',
    orderBy: 'sort_order ASC, id ASC',
    searchCols: ['question'],
    fields: ['question', 'answer', 'sort_order', 'active'],
  },
  socials: {
    table: 'social_links',
    orderBy: 'sort_order ASC, id ASC',
    searchCols: ['label'],
    fields: ['label', 'url', 'icon', 'sort_order', 'active'],
  },
  monitors: {
    table: 'monitored_sites',
    orderBy: 'id ASC',
    searchCols: ['name', 'url'],
    fields: ['name', 'url', 'active'],
  },
  messages: {
    table: 'messages',
    orderBy: 'created_at DESC',
    searchCols: ['name', 'email', 'subject'],
    fields: ['is_read'],
  },
}

function prepareValue(resource, field, value) {
  const def = RESOURCES[resource]
  if (def.jsonFields?.includes(field) && typeof value === 'object' && value !== null) {
    return JSON.stringify(value)
  }
  if (value === undefined) return null
  return value
}

export async function adminList(resource, { page = 1, perPage = 50, search = '' } = {}) {
  const def = RESOURCES[resource]
  if (!def) throw new Error(`Unknown resource "${resource}"`)
  const params = []
  let where = ''
  if (search && def.searchCols?.length) {
    where = `WHERE ${def.searchCols.map((c) => `${c} LIKE ?`).join(' OR ')}`
    def.searchCols.forEach(() => params.push(`%${search}%`))
  }
  const totalRow = await q(`SELECT COUNT(*) AS c FROM ${def.table} ${where}`, params)
  const offset = (Math.max(1, page) - 1) * perPage
  const rows = await q(
    `SELECT * FROM ${def.table} ${where} ORDER BY ${def.orderBy} LIMIT ${Number(perPage)} OFFSET ${Number(offset)}`,
    params,
  )
  return { rows, total: Number(totalRow[0].c) }
}

export async function adminCreate(resource, data) {
  const def = RESOURCES[resource]
  if (!def) throw new Error(`Unknown resource "${resource}"`)
  const row = {}
  for (const field of def.fields) {
    if (data[field] !== undefined) row[field] = prepareValue(resource, field, data[field])
  }
  if (def.slugFrom) {
    row.slug = slugify(row.slug || data[def.slugFrom] || `item-${Date.now()}`)
  }
  if (resource === 'posts' && row.status === 'published' && !row.published_at) {
    row.published_at = new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  const cols = Object.keys(row)
  if (!cols.length) throw new Error('No valid fields supplied')
  const res = await run(
    `INSERT INTO ${def.table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`,
    cols.map((c) => row[c]),
  )
  return { id: res.insertId }
}

export async function adminUpdate(resource, id, data) {
  const def = RESOURCES[resource]
  if (!def) throw new Error(`Unknown resource "${resource}"`)
  const row = {}
  for (const field of def.fields) {
    if (data[field] !== undefined) row[field] = prepareValue(resource, field, data[field])
  }
  if (def.slugFrom && row.slug !== undefined) row.slug = slugify(row.slug)
  if (resource === 'posts' && row.status === 'published' && !data.published_at) {
    const existing = await q('SELECT published_at FROM posts WHERE id = ?', [id])
    if (existing[0] && !existing[0].published_at) {
      row.published_at = new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
  }
  if (def.touchUpdated) row.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const cols = Object.keys(row)
  if (!cols.length) throw new Error('No valid fields supplied')
  await run(
    `UPDATE ${def.table} SET ${cols.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`,
    [...cols.map((c) => row[c]), id],
  )
  return { id }
}

export async function adminDelete(resource, id) {
  const def = RESOURCES[resource]
  if (!def) throw new Error(`Unknown resource "${resource}"`)
  await run(`DELETE FROM ${def.table} WHERE id = ?`, [id])
  if (resource === 'monitors') {
    await run('DELETE FROM health_checks WHERE site_id = ?', [id]).catch(() => {})
  }
  return { id }
}
