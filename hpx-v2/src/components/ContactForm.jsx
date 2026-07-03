'use client'

import { useState } from 'react'

export default function ContactForm({ presetPlan = '' }) {
  const [state, setState] = useState('idle') // idle | sending | ok | error
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setState('sending')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Something went wrong')
      setState('ok')
      form.reset()
    } catch (err) {
      setState('error')
      setError(err.message)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="form-grid-2">
        <div className="field">
          <label htmlFor="cf-name">Name</label>
          <input id="cf-name" name="name" required maxLength={120} placeholder="Your name" />
        </div>
        <div className="field">
          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" required maxLength={190} placeholder="you@company.com" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="cf-subject">What are we building?</label>
        <input id="cf-subject" name="subject" maxLength={200} placeholder="Website, app, ERP, rescue mission…" />
      </div>
      <div className="field">
        <label htmlFor="cf-plan">Interested plan</label>
        <select id="cf-plan" name="plan" defaultValue={presetPlan}>
          <option value="">Not sure yet</option>
          <option value="launch">Launch</option>
          <option value="growth">Growth</option>
          <option value="scale">Scale</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="cf-body">Details</label>
        <textarea id="cf-body" name="body" rows={5} required maxLength={4000} placeholder="Timeline, budget range, links — anything that helps me reply usefully." />
      </div>
      <button className="btn btn-ember" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      {state === 'ok' && <p className="form-note form-ok">Message received — I reply within 24 hours.</p>}
      {state === 'error' && <p className="form-note form-err">{error}</p>}
    </form>
  )
}
