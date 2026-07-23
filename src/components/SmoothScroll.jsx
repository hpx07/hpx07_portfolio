'use client'

import { useEffect } from 'react'

// Site-wide momentum ("smooth") scrolling.
//
// Interpolates the real window scroll position toward a wheel-driven target
// with a single rAF lerp — so the native scrollbar, `position: sticky`
// (the horizontal-projects pin) and anchor jumps all keep working; we only
// smooth the *rate* at which scrollY changes.
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

    const EASE = 0.11
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

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return null
}
