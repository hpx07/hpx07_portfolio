import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="login-shell">
      <div style={{ textAlign: 'center' }}>
        <p className="kicker" style={{ justifyContent: 'center' }}>404</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 460, margin: '1rem 0' }}>
          This page went <em style={{ color: 'var(--amber)' }}>off the ledger.</em>
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
          It may have been moved, unpublished, or disabled from the admin panel.
        </p>
        <Link href="/" className="btn btn-ember">Back home</Link>
      </div>
    </div>
  )
}
