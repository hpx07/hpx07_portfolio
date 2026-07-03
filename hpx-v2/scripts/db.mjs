#!/usr/bin/env node
// HPX.DEV v2 — database toolbelt
//
//   node scripts/db.mjs init [--dialect=mysql|postgres|sqlite] [--seed]
//   node scripts/db.mjs seed [--dialect=...] [--force]
//   node scripts/db.mjs export [--dialect=...] [--format=json|sql] [--target=mysql|postgres|sqlite] [--out=path]
//   node scripts/db.mjs import --file=path [--dialect=...] [--wipe]
//   node scripts/db.mjs migrate --from=mysql --to=postgres
//
// The same commands are also available from Admin → Settings → Data.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// ── tiny .env loader ─────────────────────────────────────────
for (const file of ['.env', '.env.local']) {
  const p = path.join(ROOT, file)
  if (!fs.existsSync(p)) continue
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
}

const TABLES = [
  'settings', 'posts', 'projects', 'plans', 'skills', 'testimonials',
  'faqs', 'social_links', 'messages', 'monitored_sites', 'health_checks', 'page_views',
]

const args = process.argv.slice(2)
const command = args[0]
const flag = (name, fallback = undefined) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`))
  if (hit) return hit.split('=').slice(1).join('=')
  return args.includes(`--${name}`) ? true : fallback
}

const DIALECT = String(flag('dialect', process.env.DB_DIALECT || 'mysql')).toLowerCase()

// ── connections ──────────────────────────────────────────────
async function connect(dialect, { withoutDb = false } = {}) {
  if (dialect === 'mysql') {
    const mysql = (await import('mysql2/promise')).default
    return mysql.createConnection({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: withoutDb ? undefined : process.env.MYSQL_DATABASE || 'hpx_v2',
      multipleStatements: true,
      dateStrings: true,
    })
  }
  if (dialect === 'postgres') {
    const { Client } = await import('pg')
    const client = new Client({
      host: process.env.PG_HOST || '127.0.0.1',
      port: Number(process.env.PG_PORT || 5432),
      user: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || 'postgres',
      database: withoutDb ? 'postgres' : process.env.PG_DATABASE || 'hpx_v2',
    })
    await client.connect()
    return client
  }
  if (dialect === 'sqlite') {
    const Database = (await import('better-sqlite3')).default
    const file = path.resolve(ROOT, process.env.SQLITE_FILE || './database/hpx_v2.sqlite')
    fs.mkdirSync(path.dirname(file), { recursive: true })
    return new Database(file)
  }
  throw new Error(`Unknown dialect "${dialect}"`)
}

async function queryAll(conn, dialect, sql, params = []) {
  if (dialect === 'mysql') return (await conn.query(sql, params))[0]
  if (dialect === 'postgres') {
    let i = 0
    return (await conn.query(sql.replace(/\?/g, () => `$${++i}`), params)).rows
  }
  return conn.prepare(sql).all(...params)
}

async function exec(conn, dialect, sql, params = []) {
  if (dialect === 'mysql') return conn.query(sql, params)
  if (dialect === 'postgres') {
    let i = 0
    return conn.query(sql.replace(/\?/g, () => `$${++i}`), params)
  }
  if (params.length) return conn.prepare(sql).run(...params)
  return conn.exec(sql)
}

async function close(conn, dialect) {
  if (dialect === 'mysql') await conn.end()
  else if (dialect === 'postgres') await conn.end()
  else conn.close()
}

// ── commands ─────────────────────────────────────────────────
async function cmdInit(dialect = DIALECT) {
  console.log(`→ init (${dialect})`)

  if (dialect === 'mysql') {
    const dbName = process.env.MYSQL_DATABASE || 'hpx_v2'
    const raw = await connect(dialect, { withoutDb: true })
    await raw.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    )
    await raw.end()
  } else if (dialect === 'postgres') {
    const dbName = process.env.PG_DATABASE || 'hpx_v2'
    const raw = await connect(dialect, { withoutDb: true })
    const exists = await raw.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName])
    if (!exists.rows.length) await raw.query(`CREATE DATABASE "${dbName}"`)
    await raw.end()
  }

  const schema = fs.readFileSync(path.join(ROOT, 'database', `schema.${dialect}.sql`), 'utf8')
  const conn = await connect(dialect)
  if (dialect === 'sqlite') conn.exec(schema)
  else await conn.query(schema)
  await close(conn, dialect)
  console.log('✓ schema ready')

  if (flag('seed')) await cmdSeed(dialect)
}

async function cmdSeed(dialect = DIALECT) {
  console.log(`→ seed (${dialect})`)
  const defaults = await import('../src/lib/defaults.mjs')
  const conn = await connect(dialect)

  const count = async (table) =>
    Number((await queryAll(conn, dialect, `SELECT COUNT(*) AS c FROM ${table}`))[0].c)

  const insert = async (table, row) => {
    const cols = Object.keys(row)
    const sql = `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`
    await exec(conn, dialect, sql, cols.map((c) => row[c]))
  }

  const force = !!flag('force')
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

  if (force || (await count('settings')) === 0) {
    if (force) await exec(conn, dialect, 'DELETE FROM settings')
    for (const [key, value] of Object.entries(defaults.DEFAULT_SETTINGS)) {
      await insert('settings', {
        skey: key,
        svalue: typeof value === 'string' ? value : JSON.stringify(value),
      })
    }
    console.log('  settings seeded')
  }

  const seedTable = async (table, rows, map) => {
    if (!force && (await count(table)) > 0) return
    if (force) await exec(conn, dialect, `DELETE FROM ${table}`)
    for (const row of rows) await insert(table, map(row))
    console.log(`  ${table} seeded (${rows.length})`)
  }

  await seedTable('projects', defaults.SEED_PROJECTS, (p) => ({
    ...p,
    tech: JSON.stringify(p.tech),
    highlights: JSON.stringify(p.highlights),
  }))
  await seedTable('posts', defaults.SEED_POSTS, (p) => ({
    ...p,
    tags: JSON.stringify(p.tags),
    published_at: now,
  }))
  await seedTable('plans', defaults.SEED_PLANS, (p) => ({
    ...p,
    features: JSON.stringify(p.features),
  }))
  await seedTable('skills', defaults.SEED_SKILLS, (s) => s)
  await seedTable('testimonials', defaults.SEED_TESTIMONIALS, (t) => t)
  await seedTable('faqs', defaults.SEED_FAQS, (f) => f)
  await seedTable('social_links', defaults.SEED_SOCIALS, (s) => s)
  await seedTable('monitored_sites', defaults.SEED_MONITORS, (m) => m)

  await close(conn, dialect)
  console.log('✓ seed complete')
}

function normalizeValue(v) {
  if (v instanceof Date) return v.toISOString().slice(0, 19).replace('T', ' ')
  return v
}

async function dumpAll(dialect) {
  const conn = await connect(dialect)
  const dump = {}
  for (const table of TABLES) {
    const rows = await queryAll(conn, dialect, `SELECT * FROM ${table}`)
    dump[table] = rows.map((r) => {
      const out = {}
      for (const [k, v] of Object.entries(r)) out[k] = normalizeValue(v)
      return out
    })
  }
  await close(conn, dialect)
  return dump
}

function sqlQuote(v) {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'number') return String(v)
  return `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`
}

export function dumpToSql(dump, target) {
  const lines = [`-- HPX.DEV v2 data export → ${target} — ${new Date().toISOString()}`]
  for (const [table, rows] of Object.entries(dump)) {
    if (!rows.length) continue
    lines.push(`\n-- ${table} (${rows.length} rows)`)
    for (const row of rows) {
      const cols = Object.keys(row)
      lines.push(
        `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${cols.map((c) => sqlQuote(row[c])).join(', ')});`,
      )
    }
    if (target === 'postgres' && rows[0].id !== undefined) {
      lines.push(
        `SELECT setval(pg_get_serial_sequence('${table}','id'), COALESCE((SELECT MAX(id) FROM ${table}), 1));`,
      )
    }
  }
  return lines.join('\n')
}

async function cmdExport(dialect = DIALECT) {
  const format = flag('format', 'json')
  const target = flag('target', dialect)
  console.log(`→ export from ${dialect} as ${format}`)
  const dump = await dumpAll(dialect)

  const dir = path.join(ROOT, 'database', 'exports')
  fs.mkdirSync(dir, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const out =
    flag('out') ||
    path.join(dir, `hpx-export-${stamp}.${format === 'sql' ? 'sql' : 'json'}`)

  const content =
    format === 'sql' ? dumpToSql(dump, target) : JSON.stringify({ exported_at: new Date().toISOString(), dialect, tables: dump }, null, 2)
  fs.writeFileSync(out, content, 'utf8')
  console.log(`✓ exported → ${out}`)
}

async function importDump(dump, dialect, { wipe = false } = {}) {
  const conn = await connect(dialect)
  for (const table of TABLES) {
    const rows = dump[table] || []
    if (wipe) await exec(conn, dialect, `DELETE FROM ${table}`)
    for (const row of rows) {
      const cols = Object.keys(row)
      const sql = `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`
      try {
        await exec(conn, dialect, sql, cols.map((c) => normalizeValue(row[c])))
      } catch (err) {
        console.warn(`  ! skipped a row in ${table}: ${err.message}`)
      }
    }
    if (dialect === 'postgres' && rows.length && rows[0].id !== undefined) {
      await exec(
        conn, dialect,
        `SELECT setval(pg_get_serial_sequence('${table}','id'), COALESCE((SELECT MAX(id) FROM ${table}), 1))`,
      )
    }
    if (rows.length) console.log(`  ${table}: ${rows.length} rows`)
  }
  await close(conn, dialect)
}

async function cmdImport(dialect = DIALECT) {
  const file = flag('file')
  if (!file) throw new Error('Usage: db.mjs import --file=path/to/export.json [--wipe]')
  console.log(`→ import ${file} into ${dialect}`)
  const parsed = JSON.parse(fs.readFileSync(path.resolve(ROOT, file), 'utf8'))
  await importDump(parsed.tables || parsed, dialect, { wipe: !!flag('wipe') })
  console.log('✓ import complete')
}

async function cmdMigrate() {
  const from = String(flag('from', '')).toLowerCase()
  const to = String(flag('to', '')).toLowerCase()
  if (!from || !to || from === to) {
    throw new Error('Usage: db.mjs migrate --from=mysql --to=postgres')
  }
  console.log(`→ migrate ${from} → ${to}`)
  const dump = await dumpAll(from)
  await cmdInit(to)
  await importDump(dump, to, { wipe: true })
  console.log(`✓ migration ${from} → ${to} complete`)
}

// ── run ──────────────────────────────────────────────────────
const commands = { init: () => cmdInit(), seed: () => cmdSeed(), export: () => cmdExport(), import: () => cmdImport(), migrate: cmdMigrate }

if (!commands[command]) {
  console.log('Commands: init [--seed] | seed [--force] | export [--format=json|sql] | import --file=… [--wipe] | migrate --from=… --to=…')
  process.exit(command ? 1 : 0)
}

commands[command]().then(
  () => process.exit(0),
  (err) => {
    console.error(`✗ ${err.message}`)
    process.exit(1)
  },
)
