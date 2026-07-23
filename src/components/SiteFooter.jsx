import Link from 'next/link'

// Map a social's stored `icon` (or, failing that, its url/label) to one of the
// inline glyphs below. Keeps the footer dependency-free and instant.
const ICON_ALIASES = {
  email: 'mail',
  location: 'map-pin',
  map: 'map-pin',
  twitter: 'x',
  web: 'globe',
  website: 'globe',
  link: 'globe',
  feed: 'rss',
}

function iconKey(social) {
  const raw = (social.icon || '').toLowerCase().trim()
  if (raw) return ICON_ALIASES[raw] || raw
  const hay = `${social.url || ''} ${social.label || ''}`.toLowerCase()
  if (hay.includes('github')) return 'github'
  if (hay.includes('linkedin')) return 'linkedin'
  if (hay.includes('instagram')) return 'instagram'
  if (hay.includes('dribbble')) return 'dribbble'
  if (hay.includes('behance')) return 'behance'
  if (hay.includes('facebook')) return 'facebook'
  if (hay.includes('youtube')) return 'youtube'
  if (hay.includes('twitter') || hay.includes('x.com')) return 'x'
  if (hay.startsWith('mailto') || hay.includes('mail')) return 'mail'
  if (hay.includes('map') || hay.includes('location')) return 'map-pin'
  return 'globe'
}

// 24×24 line glyphs (Lucide/Feather geometry) + two brand exceptions.
const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}
function SocialGlyph({ name }) {
  switch (name) {
    case 'github':
      return (
        <svg viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 4 5 4 5 4c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 11c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <path d="m9.75 15.02 5.75-3.27-5.75-3.27z" />
        </svg>
      )
    case 'dribbble':
      return (
        <svg viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
          <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
          <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72" />
        </svg>
      )
    case 'mail':
      return (
        <svg viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 6-10 7L2 6" />
        </svg>
      )
    case 'map-pin':
      return (
        <svg viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
    case 'rss':
      return (
        <svg viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
          <path d="M4 11a9 9 0 0 1 9 9" />
          <path d="M4 4a16 16 0 0 1 16 16" />
          <circle cx="5" cy="19" r="1" />
        </svg>
      )
    case 'x':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    case 'behance':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="var(--font-body), sans-serif" fill="currentColor">Be</text>
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20Z" />
          <path d="M2 12h20" />
        </svg>
      )
  }
}

export default function SiteFooter({ settings, socials = [] }) {
  const pages = settings.pages || {}
  const year = new Date().getFullYear()
  const wordmark = settings.logo_text || settings.site_name || ''
  const description = settings.statement || settings.tagline || ''
  const externalSocials = socials.filter((s) => (s.url || '').startsWith('http'))

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="brand footer-logo" aria-label={settings.site_name}>
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_name} />
              ) : (
                <span>{settings.logo_text || settings.site_name}</span>
              )}
            </Link>
            {description && <p className="footer-desc">{description}</p>}
            {socials.length > 0 && (
              <div className="footer-socials">
                {socials.map((s) => {
                  const external = (s.url || '').startsWith('http')
                  return (
                    <a
                      key={s.id || s.url}
                      className="social-btn"
                      href={s.url}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      aria-label={s.label}
                      title={s.label}
                    >
                      <SocialGlyph name={iconKey(s)} />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          <nav className="footer-cols" aria-label="Footer">
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
              {externalSocials.map((s) => (
                <a key={s.id || s.url} href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              ))}
              <a href="/feed.xml">RSS feed</a>
            </div>
            <div className="footer-col">
              <h4>Signal</h4>
              {settings.contact_email && (
                <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
              )}
              {settings.location_label && (
                <span className="footer-static">{settings.location_label}</span>
              )}
              {settings.availability && (
                <span className="footer-static footer-avail">
                  <span className="footer-avail-dot" aria-hidden="true" />
                  {settings.availability}
                </span>
              )}
            </div>
          </nav>
        </div>

        <div className="footer-base">
          <span>© {year} {settings.site_owner} · {settings.site_name} · All rights reserved.</span>
          {settings.footer_note && <span className="footer-note">{settings.footer_note}</span>}
        </div>
      </div>

      <p className="footer-wordmark" aria-hidden="true">{wordmark}</p>
    </footer>
  )
}
