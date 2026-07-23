// Dialect-agnostic database adapter.
// Write queries with `?` placeholders; they are translated per dialect.
// Supported: mysql (mysql2), postgres (pg), sqlite (better-sqlite3).

// A hosted Postgres connection URL, if a provider injected one.
// Vercel's Supabase integration sets POSTGRES_URL (pooled). Also honour the
// common DATABASE_URL / PG_URL names and Supabase's non-pooling fallback.
const PG_URL =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.PG_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  ''

// Explicit DB_DIALECT always wins. Otherwise auto-detect Postgres from an
// injected URL (e.g. Supabase on Vercel), else fall back to mysql (XAMPP local).
const DIALECT = (process.env.DB_DIALECT || (PG_URL ? 'postgres' : 'mysql')).toLowerCase()

// Drop any sslmode/ssl query param from a Postgres URL. pg parses the connection
// string *after* the config object, so a URL's `?sslmode=require` would otherwise
// override our explicit `ssl` option and re-enable cert-chain validation — which
// fails against Supabase's pooler cert ("self-signed certificate in chain").
function pgConnString(url) {
  try {
    const u = new URL(url)
    u.searchParams.delete('sslmode')
    u.searchParams.delete('ssl')
    return u.toString()
  } catch {
    return url
  }
}

let _client = null

export function getDialect() {
  return DIALECT
}

async function getClient() {
  if (_client) return _client

  if (DIALECT === 'mysql') {
    const mysql = (await import('mysql2/promise')).default
    _client = mysql.createPool({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'hpx_v2',
      waitForConnections: true,
      connectionLimit: 10,
      dateStrings: true,
    })
  } else if (DIALECT === 'postgres') {
    const { Pool } = await import('pg')
    _client = PG_URL
      ? new Pool({
          connectionString: pgConnString(PG_URL),
          // Supabase/hosted Postgres require TLS. The pooler certificate isn't in
          // Node's default CA bundle, so keep the connection encrypted without
          // enforcing chain validation.
          ssl: { rejectUnauthorized: false },
          max: 10,
        })
      : new Pool({
          host: process.env.PG_HOST || '127.0.0.1',
          port: Number(process.env.PG_PORT || 5432),
          user: process.env.PG_USER || 'postgres',
          password: process.env.PG_PASSWORD || 'postgres',
          database: process.env.PG_DATABASE || 'hpx_v2',
          max: 10,
        })
  } else if (DIALECT === 'sqlite') {
    const Database = (await import('better-sqlite3')).default
    const path = await import('node:path')
    const file = process.env.SQLITE_FILE || './database/hpx_v2.sqlite'
    _client = new Database(path.resolve(process.cwd(), file))
    _client.pragma('journal_mode = WAL')
  } else {
    throw new Error(`Unknown DB_DIALECT "${DIALECT}"`)
  }
  return _client
}

function toPgPlaceholders(sql) {
  let i = 0
  return sql.replace(/\?/g, () => `$${++i}`)
}

/** Run a SELECT — returns array of row objects. */
export async function q(sql, params = []) {
  const client = await getClient()
  if (DIALECT === 'mysql') {
    const [rows] = await client.query(sql, params)
    return rows
  }
  if (DIALECT === 'postgres') {
    const res = await client.query(toPgPlaceholders(sql), params)
    return res.rows
  }
  return client.prepare(sql).all(...params)
}

/** Run an INSERT/UPDATE/DELETE — returns { insertId, affected }. */
export async function run(sql, params = []) {
  const client = await getClient()
  if (DIALECT === 'mysql') {
    const [res] = await client.query(sql, params)
    return { insertId: res.insertId, affected: res.affectedRows }
  }
  if (DIALECT === 'postgres') {
    let pgSql = toPgPlaceholders(sql)
    const isInsert = /^\s*insert/i.test(pgSql) && !/returning/i.test(pgSql)
    if (isInsert) pgSql += ' RETURNING id'
    try {
      const res = await client.query(pgSql, params)
      return { insertId: res.rows?.[0]?.id ?? null, affected: res.rowCount }
    } catch (err) {
      // The RETURNING id we appended fails on tables that have no `id` column
      // (e.g. settings, PK skey). Postgres raises 42703 (undefined_column) during
      // parse — before any row is written — so retrying without RETURNING is safe.
      const noIdColumn = err.code === '42703' || /returning|column .*"?id"?/i.test(String(err.message))
      if (isInsert && noIdColumn) {
        const res = await client.query(toPgPlaceholders(sql), params)
        return { insertId: null, affected: res.rowCount }
      }
      throw err
    }
  }
  const res = client.prepare(sql).run(...params)
  return { insertId: Number(res.lastInsertRowid), affected: res.changes }
}

/** Dialect-correct "cast timestamp column to date" expression. */
export function sqlDate(col) {
  if (DIALECT === 'postgres') return `(${col})::date`
  if (DIALECT === 'sqlite') return `date(${col})`
  return `DATE(${col})`
}

/** Dialect-correct upsert for the key/value settings table. */
export async function upsertSetting(key, value) {
  if (DIALECT === 'mysql') {
    await run(
      'INSERT INTO settings (skey, svalue) VALUES (?, ?) ON DUPLICATE KEY UPDATE svalue = VALUES(svalue)',
      [key, value],
    )
  } else if (DIALECT === 'postgres') {
    await run(
      'INSERT INTO settings (skey, svalue) VALUES (?, ?) ON CONFLICT (skey) DO UPDATE SET svalue = EXCLUDED.svalue',
      [key, value],
    )
  } else {
    await run(
      'INSERT INTO settings (skey, svalue) VALUES (?, ?) ON CONFLICT (skey) DO UPDATE SET svalue = excluded.svalue',
      [key, value],
    )
  }
}

/** True if the database answers a trivial query. */
export async function dbHealthy() {
  try {
    await q('SELECT 1 AS ok')
    return true
  } catch {
    return false
  }
}
