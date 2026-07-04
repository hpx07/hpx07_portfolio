'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// First-party, cookie-less analytics beacon.
// A random session id lives in sessionStorage (cleared when the tab closes),
// so no consent-requiring identifiers are stored long-term.
export default function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return
    try {
      let sid = sessionStorage.getItem('hpx_sid')
      if (!sid) {
        sid = Math.random().toString(36).slice(2) + Date.now().toString(36)
        sessionStorage.setItem('hpx_sid', sid)
      }
      const device = window.innerWidth < 700 ? 'mobile' : window.innerWidth < 1100 ? 'tablet' : 'desktop'
      const payload = JSON.stringify({
        path: pathname,
        referrer: document.referrer || '',
        device,
        session_hash: sid,
      })
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }))
      } else {
        fetch('/api/track', { method: 'POST', body: payload, keepalive: true })
      }
    } catch {
      /* analytics must never break the site */
    }
  }, [pathname])

  return null
}
