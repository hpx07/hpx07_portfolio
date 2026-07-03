import Link from 'next/link'
import { q } from '@/lib/db'
import { getMonitorSummary, getAnalytics } from '@/lib/repos'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function safeCount(sql, params = []) {
  try {
    const rows = await q(sql, params)
    return Number(rows[0]?.c ?? 0)
  } catch {
    return null
  }
}

export default async function AdminDashboard() {
  const [posts, published, projects, unread, monitors, analytics, recent] = await Promise.all([
    safeCount('SELECT COUNT(*) AS c FROM posts'),
    safeCount("SELECT COUNT(*) AS c FROM posts WHERE status = 'published'"),
    safeCount('SELECT COUNT(*) AS c FROM projects'),
    safeCount('SELECT COUNT(*) AS c FROM messages WHERE is_read = 0'),
    getMonitorSummary().catch(() => []),
    getAnalytics(7).catch(() => null),
    q('SELECT id, name, email, subject, created_at FROM messages ORDER BY created_at DESC LIMIT 5').catch(() => []),
  ])

  const dbDown = posts === null

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Dashboard</h1>
          <p>Everything about the site and your live projects, at a glance.</p>
        </div>
        <Link href="/" target="_blank" className="a-btn ghost">View site ↗</Link>
      </div>

      {dbDown && (
        <div className="a-card" style={{ borderColor: 'rgba(255,92,92,.4)', marginBottom: '1.2rem' }}>
          <b style={{ color: 'var(--bad)' }}>Database unreachable.</b>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.4rem' }}>
            The public site is serving fallback content. Check your <code>.env</code> and run{' '}
            <code>npm run setup</code> to create and seed the database.
          </p>
        </div>
      )}

      <div className="a-grid cols-4" style={{ marginBottom: '1.2rem' }}>
        <div className="a-card a-stat">
          <b>{analytics ? analytics.totals.views : '—'}</b>
          <span>Views · last 7 days {analytics ? `· ${analytics.totals.visitors} visitors` : ''}</span>
        </div>
        <div className="a-card a-stat">
          <b>{published ?? '—'}<span style={{ fontSize: '1rem', color: 'var(--faint)' }}> / {posts ?? '—'}</span></b>
          <span>Published posts / total</span>
        </div>
        <div className="a-card a-stat">
          <b>{projects ?? '—'}</b>
          <span>Projects in portfolio</span>
        </div>
        <div className="a-card a-stat">
          <b className={unread ? 'up' : ''}>{unread ?? '—'}</b>
          <span>Unread messages</span>
        </div>
      </div>

      <div className="a-grid cols-2">
        <div className="a-card">
          <div className="admin-head" style={{ marginBottom: '0.8rem' }}>
            <h1 style={{ fontSize: '1.1rem' }}>Live project health</h1>
            <Link href="/admin/monitor" className="a-btn ghost sm">Open monitor →</Link>
          </div>
          {monitors.length === 0 && <p style={{ color: 'var(--faint)', fontSize: '0.88rem' }}>No monitored projects yet.</p>}
          {monitors.map((m) => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--line)' }}>
              <div>
                <b style={{ fontSize: '0.9rem' }}>{m.name}</b>
                <div style={{ color: 'var(--faint)', fontSize: '0.74rem' }}>{m.url}</div>
              </div>
              {m.latest ? (
                <span className={`a-badge ${Number(m.latest.ok) ? 'ok' : 'err'}`}>
                  {Number(m.latest.ok) ? `UP · ${m.latest.response_ms}ms` : `DOWN`}
                </span>
              ) : (
                <span className="a-badge">never checked</span>
              )}
            </div>
          ))}
        </div>

        <div className="a-card">
          <div className="admin-head" style={{ marginBottom: '0.8rem' }}>
            <h1 style={{ fontSize: '1.1rem' }}>Latest messages</h1>
            <Link href="/admin/messages" className="a-btn ghost sm">Inbox →</Link>
          </div>
          {recent.length === 0 && <p style={{ color: 'var(--faint)', fontSize: '0.88rem' }}>No messages yet.</p>}
          {recent.map((m) => (
            <div key={m.id} style={{ padding: '0.6rem 0', borderBottom: '1px solid var(--line)' }}>
              <b style={{ fontSize: '0.9rem' }}>{m.name}</b>{' '}
              <span style={{ color: 'var(--faint)', fontSize: '0.78rem' }}>· {m.email} · {formatDate(m.created_at)}</span>
              <div style={{ color: 'var(--muted)', fontSize: '0.84rem' }}>{m.subject || '(no subject)'}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
