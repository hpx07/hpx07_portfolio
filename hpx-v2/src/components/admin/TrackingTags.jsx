'use client'

import { useState } from 'react'

// Second tab of the analytics area — Google Tag Manager, GA4 and any custom
// pixels/scripts, saved into the seo settings blob.
export default function TrackingTags({ seo }) {
  const [form, setForm] = useState({
    gtm_id: seo.gtm_id || '',
    ga_id: seo.ga_id || '',
    custom_head: seo.custom_head || '',
  })
  const [state, setState] = useState('idle')

  const save = async () => {
    setState('saving')
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seo: { ...seo, ...form } }),
    })
    setState(res.ok ? 'ok' : 'error')
    setTimeout(() => setState('idle'), 2500)
  }

  return (
    <div className="a-card">
      <div className="a-grid cols-2">
        <div className="field">
          <label htmlFor="tt-gtm">Google Tag Manager ID</label>
          <input id="tt-gtm" placeholder="GTM-XXXXXXX" value={form.gtm_id} onChange={(e) => setForm({ ...form, gtm_id: e.target.value.trim() })} />
        </div>
        <div className="field">
          <label htmlFor="tt-ga">Google Analytics 4 ID</label>
          <input id="tt-ga" placeholder="G-XXXXXXXXXX" value={form.ga_id} onChange={(e) => setForm({ ...form, ga_id: e.target.value.trim() })} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="tt-custom">Custom tags / pixels (raw HTML, injected site-wide)</label>
        <textarea
          id="tt-custom"
          rows={5}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
          placeholder={'<script>…</script> — Meta Pixel, Hotjar, Plausible, anything.'}
          value={form.custom_head}
          onChange={(e) => setForm({ ...form, custom_head: e.target.value })}
        />
      </div>
      <button type="button" className="a-btn" onClick={save} disabled={state === 'saving'}>
        {state === 'saving' ? 'Saving…' : 'Save tracking tags'}
      </button>
      {state === 'ok' && <span className="form-note form-ok" style={{ marginLeft: '0.8rem' }}>Saved ✓</span>}
      {state === 'error' && <span className="form-note form-err" style={{ marginLeft: '0.8rem' }}>Save failed</span>}
    </div>
  )
}
