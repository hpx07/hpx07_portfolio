'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Site-wide scroll effects:
//  1. Reversible reveal — [data-reveal] elements animate in when entering the
//     viewport and animate back out when scrolled away (both directions).
//  2. Parallax — [data-prlx="0.15"] elements drift relative to scroll.
// One IntersectionObserver + one rAF loop for the whole page.
export default function ScrollFX() {
  const pathname = usePathname()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('in-view'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // toggle both ways → scrolling back up reverses the reveal
          entry.target.classList.toggle('in-view', entry.isIntersecting)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))

    // Global intensity dial — bumps the drift of every [data-prlx] element.
    const PRLX_GAIN = 1.4
    const prlxEls = Array.from(document.querySelectorAll('[data-prlx]')).map((el) => ({
      el,
      speed: (parseFloat(el.getAttribute('data-prlx')) || 0.15) * PRLX_GAIN,
    }))

    let rafId = 0
    let ticking = false
    const applyParallax = () => {
      ticking = false
      const vh = window.innerHeight
      for (const { el, speed } of prlxEls) {
        const rect = el.getBoundingClientRect()
        if (rect.bottom < -200 || rect.top > vh + 200) continue
        const centerDelta = rect.top + rect.height / 2 - vh / 2
        el.style.transform = `translate3d(0, ${(-centerDelta * speed).toFixed(1)}px, 0)`
      }
    }
    const onScroll = () => {
      if (!ticking && prlxEls.length) {
        ticking = true
        rafId = requestAnimationFrame(applyParallax)
      }
    }
    if (prlxEls.length) {
      window.addEventListener('scroll', onScroll, { passive: true })
      applyParallax()
    }

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [pathname])

  return null
}
