'use client'

import { useEffect } from 'react'

// Site-wide momentum ("smooth") scrolling.
//
// Interpolates the real window scroll position toward a target with a single
// rAF lerp — so the native scrollbar and `position: sticky` (the horizontal-
// projects pin) keep working; we only smooth the *rate* at which scrollY
// changes. The target is driven by the wheel and by in-page anchor clicks
// (which glide, offset for the fixed header, instead of jumping).
//
// Deliberately conservative — it bows out entirely when it shouldn't run:
//  • reduced-motion / low-end devices (the sitewide data-fx="lite" gate)
//  • touch / coarse pointers (native momentum is already good there)
//  • wheel events inside their own scrollable box (command palette, modals)
export default function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduced || coarse || root.dataset.fx === 'lite') return

    // We own the smoothing now. The stylesheet sets `html { scroll-behavior:
    // smooth }`, which would make the browser run its OWN animation on every
    // per-frame scrollTo() below — the two fight and the scroll rubber-bands.
    // Force instant scrolling while mounted; restore on cleanup.
    const prevScrollBehavior = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'

    const EASE = 0.14
    let target = window.scrollY
    let current = target
    let running = false
    let rafId = 0

    const maxScroll = () =>
      Math.max(0, root.scrollHeight - window.innerHeight)
    const clamp = (v) => Math.max(0, Math.min(v, maxScroll()))

    const tick = () => {
      current += (target - current) * EASE
      if (Math.abs(target - current) < 0.35) {
        current = target
        window.scrollTo(0, Math.round(current))
        running = false
        return
      }
      window.scrollTo(0, Math.round(current))
      rafId = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!running) {
        running = true
        rafId = requestAnimationFrame(tick)
      }
    }

    // Glide to an absolute Y using the same lerp the wheel drives.
    const scrollToY = (y) => {
      target = clamp(y)
      start()
    }

    // Let native scrolling win inside an element that can itself scroll along
    // the wheel's dominant axis (dropdown lists, code blocks, the ⌘K palette).
    const scrollableAncestor = (node, dx, dy) => {
      const vertical = Math.abs(dy) >= Math.abs(dx)
      let el = node
      while (el && el !== document.body && el !== root) {
        if (el.nodeType === 1) {
          const s = getComputedStyle(el)
          if (vertical) {
            const oy = s.overflowY
            if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) return true
          } else {
            const ox = s.overflowX
            if ((ox === 'auto' || ox === 'scroll') && el.scrollWidth > el.clientWidth + 1) return true
          }
        }
        el = el.parentNode
      }
      return false
    }

    const onWheel = (e) => {
      // Leave pinch-zoom and modified gestures to the browser.
      if (e.ctrlKey || e.metaKey || e.defaultPrevented) return
      if (maxScroll() <= 0) return

      let dy = e.deltaY
      if (e.deltaMode === 1) dy *= 16 // lines → px
      else if (e.deltaMode === 2) dy *= window.innerHeight // pages → px

      // Mostly-horizontal intent, or a nested scroller — hands off.
      if (Math.abs(e.deltaX) > Math.abs(dy)) return
      if (scrollableAncestor(e.target, e.deltaX, dy)) return

      e.preventDefault()
      target = clamp((running ? target : window.scrollY) + dy)
      start()
    }

    // Keep the target in step with scrolls we didn't drive (keyboard, scrollbar
    // drag, anchor jump, programmatic scrollIntoView) so the next wheel tick
    // doesn't yank the page back.
    const onScroll = () => {
      if (!running) {
        target = window.scrollY
        current = window.scrollY
      }
    }

    // Smooth in-page anchor links (href="#id" / same-page "/#id") through the
    // lerp instead of an instant jump, offset for the fixed header.
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest?.('a')
      if (!a) return
      const href = a.getAttribute('href') || ''
      let hash = ''
      if (href.startsWith('#')) hash = href
      else if (href.startsWith('/#') && window.location.pathname === '/') hash = href.slice(1)
      if (hash.length < 2) return

      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (!el) return

      e.preventDefault()
      const navH = document.querySelector('.site-nav')?.offsetHeight || 0
      scrollToY(window.scrollY + el.getBoundingClientRect().top - navH - 12)
      if (window.location.hash !== hash) history.pushState(null, '', hash)

      // Keep keyboard focus in step, without letting focus() re-jump the page.
      if (el.tabIndex < 0) el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(rafId)
      root.style.scrollBehavior = prevScrollBehavior
    }
  }, [])

  return null
}
