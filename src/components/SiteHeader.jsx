'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'

export default function SiteHeader({ settings }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const pages = settings.pages || {}

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  const links = [
    pages.projects !== false && { href: '/projects', label: 'Projects' },
    pages.blog !== false && { href: '/blog', label: 'Blog' },
    pages.plans !== false && { href: '/plans', label: 'Plans' },
    pages.contact !== false && { href: '/contact', label: 'Contact' },
  ].filter(Boolean)

  const openPalette = () => window.dispatchEvent(new CustomEvent('hpx:cmdk'))

  return (
    <>
      <header className={`site-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="wrap site-nav-inner">
          <Link href="/" className="brand" aria-label={settings.site_name}>
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.site_name} />
            ) : (
              <>
                <span>{settings.logo_text || settings.site_name}</span>
              </>
            )}
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname.startsWith(link.href) ? 'active' : ''}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav-right">
            <ThemeToggle />
            <button type="button" className="nav-kbd" onClick={openPalette} aria-label="Open command palette">
              <span>⌘K</span>
            </button>
            {settings.availability && (
              <a href={`mailto:${settings.contact_email}`} className="status-pill">
                <span className="status-dot" />
                {settings.availability}
              </a>
            )}
            <button
              type="button"
              className="burger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link href="/">Home</Link>
        {links.map((link) => (
          <Link key={link.href} href={link.href}>{link.label}</Link>
        ))}
      </div>
    </>
  )
}
