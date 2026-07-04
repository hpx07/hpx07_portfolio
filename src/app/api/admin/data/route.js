// Data portability from the admin panel:
//   GET  /api/admin/data?format=json            → downloadable JSON dump
//   GET  /api/admin/data?format=sql&target=postgres → INSERT statements for the target dialect
//   POST /api/admin/data  { tables: {...}, wipe: true } → import a JSON dump
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { q, run, getDialect } from '@/lib/db'

const TABLES = [
  'settings', 'posts', 'projects', 'plans', 'skills', 'testimonials',
  'faqs', 'social_links', 'messages', 'monitored_sites', 'health_checks', 'page_views',
]

function normalize(v) {
  if (v instanceof Date) return v.toISOString().slice(0, 19).replace('T', ' ')
  return v
}

async function dumpAll() {
  const dump = {}
  for (const table of TABLES) {
    const rows = await q(`SELECT * FROM ${table}`)
    dump[table] = rows.map((r) => {
      const out = {}
      for (const [k, v] of Object.entries(r)) out[k] = normalize(v)
      return out
    })
  }
  return dump
}

function sqlQuote(v) {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'number') return String(v)
  return `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`
}

function toSql(dump, target) {
  const lines = [`-- HPX.DEV v2 data export → ${target} — ${new Date().toISOString()}`]
  for (const [table, rows] of Object.entries(dump)) {
    if (!rows.length) continue
    lines.push(`\n-- ${table} (${rows.length} rows)`)
    for (const row of rows) {
      const cols = Object.keys(row)
      lines.push(`INSERT INTO ${table} (${cols.join(', ')}) VALUES (${cols.map((c) => sqlQuote(row[c])).join(', ')});`)
    }
    if (target === 'postgres' && rows[0].id !== undefined) {
      lines.push(`SELECT setval(pg_get_serial_sequence('${table}','id'), COALESCE((SELECT MAX(id) FROM ${table}), 1));`)
    }
  }
  return lines.join('\n')
}

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const format = url.searchParams.get('format') || 'json'
    const target = url.searchParams.get('target') || getDialect()
    const dump = await dumpAll()
    const stamp = new Date().toISOString().slice(0, 10)

    if (format === 'sql') {
      return new Response(toSql(dump, target), {
        headers: {
          'Content-Type': 'application/sql; charset=utf-8',
          'Content-Disposition': `attachment; filename="hpx-export-${target}-${stamp}.sql"`,
        },
      })
    }
    return new Response(
      JSON.stringify({ exported_at: new Date().toISOString(), dialect: getDialect(), tables: dump }, null, 2),
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="hpx-export-${stamp}.json"`,
        },
      },
    )
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const tables = body.tables || body
    const wipe = !!body.wipe
    const report = {}
    for (const table of TABLES) {
      const rows = Array.isArray(tables[table]) ? tables[table] : []
      if (wipe) await run(`DELETE FROM ${table}`)
      let inserted = 0
      for (const row of rows) {
        const cols = Object.keys(row)
        try {
          await run(
            `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`,
            cols.map((c) => normalize(row[c])),
          )
          inserted++
        } catch {
          /* skip conflicting rows */
        }
      }
      if (rows.length) report[table] = `${inserted}/${rows.length}`
    }
    revalidatePath('/', 'layout')
    return NextResponse.json({ ok: true, report })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
