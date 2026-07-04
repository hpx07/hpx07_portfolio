import Link from 'next/link'

export default function SiteFooter({ settings, socials = [] }) {
  const pages = settings.pages || {}
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand">
              <span className="brand-dot" aria-hidden="true" />
              <span>{settings.logo_text || settings.site_name}</span>
            </div>
            <p>{settings.tagline} — {settings.location_label}.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Explore</h4>
              <Link href="/">Home</Link>
              {pages.projects !== false && <Link href="/projects">Projects</Link>}
              {pages.blog !== false && <Link href="/blog">Blog</Link>}
              {pages.plans !== false && <Link href="/plans">Plans</Link>}
              {pages.contact !== false && <Link href="/contact">Contact</Link>}
            </div>
            <div className="footer-col">
              <h4>Elsewhere</h4>
              {socials.map((s) => (
                <a
                  key={s.id || s.url}
                  href={s.url}
                  target={s.url.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              ))}
              <a href="/feed.xml">RSS feed</a>
            </div>
            <div className="footer-col">
              <h4>Signal</h4>
              <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
              <a href="https://www.google.com/maps?q=31.9502,75.6175" target="_blank" rel="noopener noreferrer">
                {settings.location_coords}
              </a>
            </div>
          </div>
        </div>
        <p className="footer-wordmark" aria-hidden="true">{settings.logo_text || settings.site_name}</p>
        <div className="footer-base">
          <span>© {year} {settings.site_owner} · {settings.site_name}</span>
          <span>{settings.footer_note}</span>
        </div>
      </div>
    </footer>
  )
}
