'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MonitorBoard({ summary }) {
  const [busy, setBusy] = useState(false)
  const [psi, setPsi] = useState({}) // siteId -> { loading, data, error }
  const [adding, setAdding] = useState(false)
  const router = useRouter()

  const runChecks = async () => {
    setBusy(true)
    await fetch('/api/admin/monitor/check', { method: 'POST' })
    setBusy(false)
    router.refresh()
  }

  const addSite = async (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    if (!data.name || !data.url) return
    setAdding(true)
    await fetch('/api/admin/monitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, active: 1 }),
    })
    setAdding(false)
    e.target.reset()
    router.refresh()
  }

  const removeSite = async (site) => {
    if (!confirm(`Stop monitoring "${site.name}"?`)) return
    await fetch(`/api/admin/monitors/${site.id}`, { method: 'DELETE' })
    router.refresh()
  }

  const runPsi = async (site) => {
    setPsi((p) => ({ ...p, [site.id]: { loading: true } }))
    try {
      const res = await fetch(`/api/admin/monitor/pagespeed?url=${encodeURIComponent(site.url)}`)
      const data = await res.json()
      setPsi((p) => ({ ...p, [site.id]: res.ok ? { data } : { error: data.error } }))
    } catch (err) {
      setPsi((p) => ({ ...p, [site.id]: { error: err.message } }))
    }
  }

  const scoreBadge = (v) => (v == null ? '' : v >= 90 ? 'ok' : v >= 50 ? 'warn' : 'err')

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Project health</h1>
          <p>Uptime, response times and Google PageSpeed insight for every live project you ship.</p>
        </div>
        <button type="button" className="a-btn" onClick={runChecks} disabled={busy}>
          {busy ? 'Checking…' : '⟳ Run health check'}
        </button>
      </div>

      <form className="a-card" onSubmit={addSite} style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '1.2rem' }}>
        <div className="field" style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
          <label htmlFor="mn-name">Project name</label>
          <input id="mn-name" name="name" placeholder="Client dashboard" required />
        </div>
        <div className="field" style={{ flex: 2, minWidth: 240, marginBottom: 0 }}>
          <label htmlFor="mn-url">Live URL</label>
          <input id="mn-url" name="url" type="url" placeholder="https://…" required />
        </div>
        <button className="a-btn ghost" type="submit" disabled={adding}>+ Monitor project</button>
      </form>

      <div className="a-grid">
        {summary.length === 0 && (
          <div className="a-card" style={{ color: 'var(--faint)' }}>No projects monitored yet — add your first one above.</div>
        )}
        {summary.map((site) => {
          const p = psi[site.id]
          return (
            <div className="a-card" key={site.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <b>{site.name}</b>{' '}
                  <a href={site.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--faint)', fontSize: '0.8rem' }}>
                    {site.url} ↗
                  </a>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {site.latest ? (
                    <span className={`a-badge ${Number(site.latest.ok) ? 'ok' : 'err'}`}>
                      {Number(site.latest.ok) ? 'UP' : 'DOWN'} · HTTP {site.latest.status_code || '—'} · {site.latest.response_ms}ms
                    </span>
                  ) : (
                    <span className="a-badge">never checked</span>
                  )}
                  {site.uptime != null && <span className={`a-badge ${site.uptime >= 99 ? 'ok' : site.uptime >= 90 ? 'warn' : 'err'}`}>{site.uptime}% uptime</span>}
                  {site.avgMs != null && <span className="a-badge">avg {site.avgMs}ms</span>}
                  <button type="button" className="a-btn ghost sm" onClick={() => runPsi(site)} disabled={p?.loading}>
                    {p?.loading ? 'Auditing…' : 'PageSpeed'}
                  </button>
                  <button type="button" className="a-btn danger sm" onClick={() => removeSite(site)}>Remove</button>
                </div>
              </div>

              {site.history?.length > 0 && (
                <div className="uptime-strip" style={{ marginTop: '0.9rem' }} title="Last checks (oldest → newest)">
                  {site.history.map((h, i) => (
                    <i key={i} className={Number(h.ok) ? 'up' : 'down'} title={`${h.checked_at} · ${Number(h.ok) ? 'up' : 'down'} · ${h.response_ms}ms`} />
                  ))}
                </div>
              )}

              {p?.error && <p className="form-note form-err">{p.error}</p>}
              {p?.data && (
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.9rem' }}>
                  <span className={`a-badge ${scoreBadge(p.data.scores.performance)}`}>Performance {p.data.scores.performance ?? '—'}</span>
                  <span className={`a-badge ${scoreBadge(p.data.scores.seo)}`}>SEO {p.data.scores.seo ?? '—'}</span>
                  <span className={`a-badge ${scoreBadge(p.data.scores.accessibility)}`}>Accessibility {p.data.scores.accessibility ?? '—'}</span>
                  <span className={`a-badge ${scoreBadge(p.data.scores.bestPractices)}`}>Best practices {p.data.scores.bestPractices ?? '—'}</span>
                  {p.data.metrics.lcp && <span className="a-badge">LCP {p.data.metrics.lcp}</span>}
                  {p.data.metrics.cls && <span className="a-badge">CLS {p.data.metrics.cls}</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
