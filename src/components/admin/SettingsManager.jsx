'use client'

import { useEffect, useRef, useState } from 'react'
import { ImageField } from '@/components/admin/ResourceManager'

const TABS = ['Brand', 'Home content', 'Sections & pages', 'SEO', 'Data']

const SECTION_LABELS = {
  hero: 'Hero',
  statement: 'Statement',
  stats: 'Stats strip',
  projects: 'Projects preview',
  tech: 'Tools & technologies',
  process: 'Process',
  plans: 'Plans preview',
  testimonials: 'Testimonials',
  blog: 'Blog preview',
  faq: 'FAQ',
  contact: 'Contact section',
}
const PAGE_LABELS = {
  projects: '/projects page',
  blog: '/blog page',
  plans: '/plans page',
  contact: '/contact page',
}

function Text({ form, set, name, label, textarea, rows = 3, mono }) {
  return (
    <div className="field">
      <label htmlFor={`s-${name}`}>{label}</label>
      {textarea ? (
        <textarea
          id={`s-${name}`}
          rows={rows}
          value={form[name] ?? ''}
          onChange={(e) => set(name, e.target.value)}
          style={mono ? { fontFamily: 'var(--font-mono)', fontSize: '0.8rem' } : undefined}
        />
      ) : (
        <input id={`s-${name}`} value={form[name] ?? ''} onChange={(e) => set(name, e.target.value)} />
      )}
    </div>
  )
}

export default function SettingsManager() {
  const [tab, setTab] = useState('Brand')
  const [form, setForm] = useState(null)
  const [state, setState] = useState('idle')
  const [importReport, setImportReport] = useState('')
  const importRef = useRef(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        setForm({
          ...data,
          stats_json: JSON.stringify(data.stats || [], null, 2),
          process_json: JSON.stringify(data.process || [], null, 2),
        })
      })
  }, [])

  if (!form) return <p style={{ color: 'var(--faint)' }}>Loading settings…</p>

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const setSeo = (key, value) => setForm((f) => ({ ...f, seo: { ...f.seo, [key]: value } }))
  const setToggle = (group, key, value) =>
    setForm((f) => ({ ...f, [group]: { ...f[group], [key]: value } }))

  const save = async () => {
    setState('saving')
    const patch = { ...form }
    delete patch._db
    try {
      patch.stats = JSON.parse(form.stats_json)
      patch.process = JSON.parse(form.process_json)
    } catch {
      setState('error')
      alert('Stats or Process JSON is invalid — fix it before saving.')
      return
    }
    delete patch.stats_json
    delete patch.process_json
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    setState(res.ok ? 'ok' : 'error')
    setTimeout(() => setState('idle'), 2500)
  }

  const importJson = async (file) => {
    setImportReport('Importing…')
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...parsed, wipe: confirm('Wipe existing data before import? OK = replace everything, Cancel = merge (skip conflicts).') }),
      })
      const json = await res.json()
      setImportReport(res.ok ? `Imported: ${JSON.stringify(json.report)}` : json.error)
    } catch (err) {
      setImportReport(`Import failed: ${err.message}`)
    }
  }

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Settings & SEO</h1>
          <p>Brand, logo & favicon, section toggles, global SEO and data portability.</p>
        </div>
        <div>
          <button type="button" className="a-btn" onClick={save} disabled={state === 'saving'}>
            {state === 'saving' ? 'Saving…' : 'Save all settings'}
          </button>
          {state === 'ok' && <span className="form-note form-ok" style={{ marginLeft: '0.7rem' }}>Saved ✓</span>}
          {state === 'error' && <span className="form-note form-err" style={{ marginLeft: '0.7rem' }}>Failed</span>}
        </div>
      </div>

      {!form._db && (
        <p className="form-note form-err" style={{ marginBottom: '1rem' }}>
          Database unreachable — settings shown are defaults and saving will fail. Run <code>npm run setup</code>.
        </p>
      )}

      <div className="a-tabs">
        {TABS.map((t) => (
          <button key={t} type="button" className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'Brand' && (
        <div className="a-card">
          <div className="a-grid cols-2">
            <Text form={form} set={set} name="site_name" label="Site name" />
            <Text form={form} set={set} name="site_owner" label="Owner / founder name" />
            <Text form={form} set={set} name="tagline" label="Tagline" />
            <Text form={form} set={set} name="logo_text" label="Logo text (when no image logo)" />
            <div className="field">
              <label>Logo image (blank = text logo)</label>
              <ImageField value={form.logo_url} onChange={(v) => set('logo_url', v)} kind="logo" />
            </div>
            <div className="field">
              <label>Favicon (.ico / .png / .svg)</label>
              <ImageField value={form.favicon_url} onChange={(v) => set('favicon_url', v)} kind="favicon" />
            </div>
            <Text form={form} set={set} name="contact_email" label="Contact email" />
            <Text form={form} set={set} name="availability" label="Availability badge (blank = hidden)" />
            <Text form={form} set={set} name="location_label" label="Location label" />
            <Text form={form} set={set} name="location_coords" label="Location coordinates (footer)" />
            <div className="field">
              <label htmlFor="s-default_theme">Default theme for new visitors</label>
              <select
                id="s-default_theme"
                value={form.default_theme === 'light' ? 'light' : 'dark'}
                onChange={(e) => set('default_theme', e.target.value)}
              >
                <option value="dark">Dark — Ember & Ivory</option>
                <option value="light">Light — Ivory Ledger</option>
              </select>
            </div>
          </div>
          <Text form={form} set={set} name="footer_note" label="Footer note" />
        </div>
      )}

      {tab === 'Home content' && (
        <div className="a-card">
          <div className="a-grid cols-2">
            <Text form={form} set={set} name="hero_kicker" label="Hero kicker" />
            <Text form={form} set={set} name="hero_accent_word" label="Hero accent word (rendered in ember italic)" />
          </div>
          <Text form={form} set={set} name="hero_title" label="Hero title" />
          <Text form={form} set={set} name="hero_copy" label="Hero copy" textarea />
          <Text form={form} set={set} name="statement" label="Statement section" textarea rows={2} />
          <div className="a-grid cols-2">
            <Text form={form} set={set} name="stats_json" label='Stats (JSON: [{"value","label"}])' textarea rows={10} mono />
            <Text form={form} set={set} name="process_json" label='Process steps (JSON: [{"step","title","copy"}])' textarea rows={10} mono />
          </div>
        </div>
      )}

      {tab === 'Sections & pages' && (
        <div className="a-grid cols-2">
          <div className="a-card">
            <h2 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Home page sections</h2>
            {Object.entries(SECTION_LABELS).map(([key, label]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ fontSize: '0.9rem' }}>{label}</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={form.sections?.[key] !== false}
                    onChange={(e) => setToggle('sections', key, e.target.checked)}
                  />
                  <i />
                </label>
              </div>
            ))}
          </div>
          <div className="a-card">
            <h2 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Pages</h2>
            {Object.entries(PAGE_LABELS).map(([key, label]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ fontSize: '0.9rem' }}>{label}</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={form.pages?.[key] !== false}
                    onChange={(e) => setToggle('pages', key, e.target.checked)}
                  />
                  <i />
                </label>
              </div>
            ))}
            <p style={{ color: 'var(--faint)', fontSize: '0.78rem', marginTop: '1rem' }}>
              Disabled pages return 404, drop out of navigation, sitemap and search.
            </p>
          </div>
        </div>
      )}

      {tab === 'SEO' && (
        <div className="a-card">
          <Text form={form.seo} set={setSeo} name="meta_title" label="Default meta title" />
          <Text form={form.seo} set={setSeo} name="meta_description" label="Default meta description" textarea rows={3} />
          <Text form={form.seo} set={setSeo} name="keywords" label="Keywords" />
          <div className="field">
            <label>Default social share image (Open Graph)</label>
            <ImageField value={form.seo?.og_image} onChange={(v) => setSeo('og_image', v)} kind="og" />
          </div>
          <div className="a-grid cols-2">
            <Text form={form.seo} set={setSeo} name="twitter_handle" label="Twitter/X handle (@…)" />
            <Text form={form.seo} set={setSeo} name="verification_google" label="Google site verification code" />
          </div>
          <p style={{ color: 'var(--faint)', fontSize: '0.78rem' }}>
            GTM / GA4 / custom pixels live under <b>Analytics & tags</b>. Per-post and per-project SEO fields are in their own editors.
            Sitemap, robots.txt, RSS, canonical URLs and JSON-LD are generated automatically.
          </p>
        </div>
      )}

      {tab === 'Data' && (
        <div className="a-grid cols-2">
          <div className="a-card">
            <h2 style={{ fontSize: '0.95rem', marginBottom: '0.6rem' }}>Export</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.84rem', marginBottom: '1rem' }}>
              Full content dump — settings, posts, projects, plans, analytics, everything.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <a className="a-btn ghost sm" href="/api/admin/data?format=json">JSON backup</a>
              <a className="a-btn ghost sm" href="/api/admin/data?format=sql&target=mysql">SQL (MySQL)</a>
              <a className="a-btn ghost sm" href="/api/admin/data?format=sql&target=postgres">SQL (PostgreSQL)</a>
            </div>
          </div>
          <div className="a-card">
            <h2 style={{ fontSize: '0.95rem', marginBottom: '0.6rem' }}>Import / migrate</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.84rem', marginBottom: '1rem' }}>
              Restore a JSON backup into the current database ({' '}any dialect{' '}). For full
              cross-database moves use <code>npm run db:migrate -- --from=mysql --to=postgres</code>.
            </p>
            <input ref={importRef} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
            <button type="button" className="a-btn ghost sm" onClick={() => importRef.current?.click()}>Import JSON backup</button>
            {importReport && <p className="form-note" style={{ marginTop: '0.8rem' }}>{importReport}</p>}
          </div>
        </div>
      )}
    </>
  )
}
