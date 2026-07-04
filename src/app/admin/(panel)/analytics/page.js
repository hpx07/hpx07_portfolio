import Link from 'next/link'
import { getAnalytics, getSettings } from '@/lib/repos'
import TrackingTags from '@/components/admin/TrackingTags'

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage({ searchParams }) {
  const sp = await searchParams
  const days = [7, 30, 90].includes(Number(sp?.days)) ? Number(sp.days) : 30
  const [settings, analytics] = await Promise.all([
    getSettings(),
    getAnalytics(days).catch(() => null),
  ])

  const maxViews = analytics ? Math.max(1, ...analytics.byDay.map((d) => d.views)) : 1
  const deviceTotal = analytics ? analytics.devices.reduce((s, d) => s + Number(d.views), 0) || 1 : 1

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Analytics</h1>
          <p>First-party, cookie-less analytics collected by this site itself — plus your external tracking tags.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[7, 30, 90].map((d) => (
            <Link key={d} href={`/admin/analytics?days=${d}`} className={`a-btn sm ${d === days ? '' : 'ghost'}`}>
              {d}d
            </Link>
          ))}
        </div>
      </div>

      {!analytics ? (
        <div className="a-card" style={{ color: 'var(--muted)' }}>
          No analytics data yet — the database may not be initialised, or nobody has visited the public site.
        </div>
      ) : (
        <>
          <div className="a-grid cols-3" style={{ marginBottom: '1.2rem' }}>
            <div className="a-card a-stat">
              <b>{analytics.totals.views.toLocaleString()}</b>
              <span>Page views · last {days} days</span>
            </div>
            <div className="a-card a-stat">
              <b>{analytics.totals.visitors.toLocaleString()}</b>
              <span>Unique sessions</span>
            </div>
            <div className="a-card a-stat">
              <b>
                {analytics.totals.visitors
                  ? (analytics.totals.views / analytics.totals.visitors).toFixed(1)
                  : '0'}
              </b>
              <span>Pages per session</span>
            </div>
          </div>

          <div className="a-card" style={{ marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Views per day</h2>
            <div className="bar-chart">
              {analytics.byDay.map((d) => (
                <div key={d.day} className="bar" style={{ height: `${Math.max(2, (d.views / maxViews) * 100)}%` }}>
                  <span className="tip">{d.day}: {d.views} views · {d.visitors} visitors</span>
                </div>
              ))}
              {analytics.byDay.length === 0 && <p style={{ color: 'var(--faint)' }}>No views recorded in this period.</p>}
            </div>
          </div>

          <div className="a-grid cols-3" style={{ marginBottom: '1.2rem' }}>
            <div className="a-card">
              <h2 style={{ fontSize: '0.95rem', marginBottom: '0.8rem' }}>Top pages</h2>
              {analytics.topPages.map((p) => (
                <div key={p.path} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--line)', fontSize: '0.84rem' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.path}</span>
                  <b>{p.views}</b>
                </div>
              ))}
              {analytics.topPages.length === 0 && <p style={{ color: 'var(--faint)', fontSize: '0.84rem' }}>—</p>}
            </div>
            <div className="a-card">
              <h2 style={{ fontSize: '0.95rem', marginBottom: '0.8rem' }}>Referrers</h2>
              {analytics.referrers.map((r) => (
                <div key={r.referrer} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--line)', fontSize: '0.84rem' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.referrer}</span>
                  <b>{r.views}</b>
                </div>
              ))}
              {analytics.referrers.length === 0 && <p style={{ color: 'var(--faint)', fontSize: '0.84rem' }}>Direct traffic only so far.</p>}
            </div>
            <div className="a-card">
              <h2 style={{ fontSize: '0.95rem', marginBottom: '0.8rem' }}>Devices</h2>
              {analytics.devices.map((d) => (
                <div key={d.device || 'unknown'} style={{ padding: '0.35rem 0', fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{d.device || 'unknown'}</span>
                    <b>{Math.round((Number(d.views) / deviceTotal) * 100)}%</b>
                  </div>
                  <div style={{ height: 4, background: 'var(--bg-3)', borderRadius: 4, marginTop: 4 }}>
                    <div style={{ height: '100%', width: `${(Number(d.views) / deviceTotal) * 100}%`, background: 'var(--grad)', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', margin: '1.6rem 0 0.9rem' }}>Tracking tags</h2>
      <TrackingTags seo={settings.seo || {}} />
    </>
  )
}
