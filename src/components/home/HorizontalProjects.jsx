'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import ProjectCard from '@/components/ProjectCard'

// Home "Selected work" rail.
//  • Desktop (fine pointer, ≥900px, motion allowed): the section pins
//    full-screen and vertical scroll is translated into horizontal card
//    motion; when the last card is reached the pin releases and the page
//    scrolls on vertically as normal.
//  • Mobile / reduced-motion / no-JS: a native horizontal swipe carousel
//    with scroll-snap — the page keeps its normal vertical scroll.
export default function HorizontalProjects({ projects }) {
  const outerRef = useRef(null)
  const pinRef = useRef(null)
  const viewportRef = useRef(null)
  const rowRef = useRef(null)

  useEffect(() => {
    const outer = outerRef.current
    const pin = pinRef.current
    const viewport = viewportRef.current
    const row = rowRef.current
    if (!outer || !pin || !viewport || !row) return

    const deskMq = window.matchMedia('(min-width: 900px) and (pointer: fine)')
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    // Vertical scroll spent per unit of horizontal rail travel. >1 slows the
    // rail down (you scroll further to move the cards the same distance).
    const SCROLL_FACTOR = 1.8
    let enabled = false
    let maxShift = 0
    let scrollLen = 0
    let rafId = 0
    let ticking = false

    const measure = () => {
      // Horizontal distance the rail must travel = content width beyond the
      // visible viewport. Unaffected by the current transform (layout width).
      maxShift = Math.max(0, row.scrollWidth - viewport.clientWidth)
      scrollLen = maxShift * SCROLL_FACTOR
      if (enabled && maxShift > 24) {
        // Give the sticky pin `scrollLen` of vertical scroll room for `maxShift`
        // of horizontal travel — the ratio is what sets the rail's speed.
        outer.style.height = `${Math.round(window.innerHeight + scrollLen)}px`
      } else {
        outer.style.height = ''
        row.style.transform = ''
      }
    }

    const render = () => {
      ticking = false
      if (!enabled || maxShift <= 24) return
      const top = outer.getBoundingClientRect().top
      const progress = Math.min(1, Math.max(0, -top / scrollLen))
      row.style.transform = `translate3d(${(-progress * maxShift).toFixed(1)}px, 0, 0)`
    }

    const onScroll = () => {
      if (!enabled || ticking) return
      ticking = true
      rafId = requestAnimationFrame(render)
    }

    const apply = () => {
      enabled = deskMq.matches && !reducedMq.matches
      pin.classList.toggle('is-pinned', enabled)
      measure()
      render()
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', apply)
    deskMq.addEventListener?.('change', apply)
    reducedMq.addEventListener?.('change', apply)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', apply)
      deskMq.removeEventListener?.('change', apply)
      reducedMq.removeEventListener?.('change', apply)
      cancelAnimationFrame(rafId)
      pin.classList.remove('is-pinned')
      outer.style.height = ''
      row.style.transform = ''
    }
  }, [])

  return (
    <section className="section hscroll" id="projects" ref={outerRef}>
      <div className="hscroll-pin" ref={pinRef}>
        <div className="wrap section-head hscroll-head">
          <div>
            <span className="kicker" data-reveal>01 — Selected work</span>
            <h2 data-reveal>Projects that <em>earn their keep</em></h2>
          </div>
          <Link href="/projects" className="section-link" data-reveal>All projects →</Link>
        </div>
        <div className="hscroll-viewport" ref={viewportRef}>
          <div className="hscroll-row" ref={rowRef}>
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} delay={0} />
            ))}
            <Link href="/projects" className="hscroll-end" aria-label="See all projects">
              <span className="hscroll-end-label">All projects</span>
              <span className="hscroll-end-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
