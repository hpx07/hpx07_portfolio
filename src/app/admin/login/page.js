'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  const search = useSearchParams()

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const next = search.get('next')
      router.push(next && next.startsWith('/admin') ? next : '/admin')
      router.refresh()
    } else {
      setError('Invalid credentials')
      setBusy(false)
    }
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={onSubmit}>
        <div className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <span>HPX.DEV</span>
        </div>
        <h1>Admin panel</h1>
        <div className="field">
          <label htmlFor="lg-user">Username</label>
          <input id="lg-user" name="user" autoComplete="username" required />
        </div>
        <div className="field">
          <label htmlFor="lg-pass">Password</label>
          <input id="lg-pass" name="password" type="password" autoComplete="current-password" required />
        </div>
        <button className="a-btn" type="submit" disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        {error && <p className="form-note form-err">{error}</p>}
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
