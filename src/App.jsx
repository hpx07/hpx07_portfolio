import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import SplitType from 'split-type'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const workItems = [
  {
    title: 'LensCraft Portfolio',
    category: 'Photography Platform',
    summary:
      'A full-stack photography portfolio with dynamic galleries, EXIF filters, and lightning-fast image delivery.',
    gradient:
      'linear-gradient(140deg, #6ee7ff 0%, #2958ff 46%, #140f39 100%)',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
  },
  {
    title: 'StackPulse Console',
    category: 'SaaS Dashboard',
    summary:
      'A modern analytics workspace built with React and Node.js for real-time product and infrastructure insights.',
    gradient:
      'linear-gradient(130deg, #ffca80 0%, #ff6e7a 48%, #3b1639 100%)',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  },
  {
    title: 'Nomad Notes',
    category: 'Cross-platform PWA',
    summary:
      'An offline-ready writing app synchronized across devices with clean UX, smart search, and cloud backup.',
    gradient:
      'linear-gradient(140deg, #6af7c0 0%, #15b79a 50%, #11302d 100%)',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
  },
  {
    title: 'Pixel Drift Stories',
    category: 'Visual Storytelling',
    summary:
      'A cinematic storytelling site mixing motion direction, typography, and photography to create high-impact narratives.',
    gradient:
      'linear-gradient(140deg, #ff9dd8 0%, #ff6979 45%, #2c1434 100%)',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
  },
  {
    title: 'FlowOps Control Room',
    category: 'Developer Platform',
    summary:
      'A scalable full-stack control panel with role-based access, workflow automation, and observability-first architecture.',
    gradient:
      'linear-gradient(140deg, #9fd0ff 0%, #6b7bff 50%, #181f4b 100%)',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop',
  },
]

const partnerNames = [
  'JavaScript',
  'TypeScript',
  'Php',
  'React',
  'Next.js',
  'Node.js',
  'SQL',
  'GSAP',
  'Android Studio',
  'Lightroom',
  'Photoshop',
  'Claude',
  'Copilot',
]

const expertisePanels = [
  {
    number: '01',
    title: 'Design',
    headline: 'Interfaces that feel alive',
    description:
      'From wireframes to polished prototypes, I craft digital experiences where every pixel has purpose — balancing aesthetics with usability to create interfaces users love.',
    skills: ['UI / UX Design', 'Design Systems', 'Motion & Interactions', 'Prototyping', 'Brand Identity'],
    accent: '#7ce8ff',
    bg: 'linear-gradient(165deg, #0f1b3d 0%, #0a1628 50%, #070b16 100%)',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=600&fit=crop',
  },
  {
    number: '02',
    title: 'Engineering',
    headline: 'Code that scales and ships',
    description:
      'I build full-stack applications with clean architecture, type-safe code, and production-hardened infrastructure — engineered for performance under real-world pressure.',
    skills: ['React / Next.js', 'Node.js / Express', 'TypeScript', 'Cloud & DevOps', 'API Design'],
    accent: '#ff8e5b',
    bg: 'linear-gradient(165deg, #1f1020 0%, #150d22 50%, #070b16 100%)',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=600&fit=crop',
  },
  {
    number: '03',
    title: 'Strategy',
    headline: 'Vision into execution',
    description:
      'I connect business goals to technical roadmaps. Every project starts with understanding the "why" — then mapping the fastest path from concept to shipped product.',
    skills: ['Product Strategy', 'Technical Architecture', 'Performance Optimization', 'Growth Engineering'],
    accent: '#5dff9f',
    bg: 'linear-gradient(165deg, #0a1f1a 0%, #0c1620 50%, #070b16 100%)',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=600&fit=crop',
  },

]

function getIsLowEnd() {
  if (typeof window === 'undefined') return false
  const cores = navigator.hardwareConcurrency || 4
  const conn = navigator.connection
  const slow = conn && ['slow-2g', '2g', '3g'].includes(conn.effectiveType)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return cores <= 4 || slow || reduced
}

function App() {
  const [experienceStarted, setExperienceStarted] = useState(false)
  const appRef = useRef(null)
  const magneticButtonRef = useRef(null)
  const introTimelineRef = useRef(null)
  const splitRef = useRef(null)
  const preloaderTitleRef = useRef(null)
  const smokeRef = useRef(null)
  const lenisRef = useRef(null)
  const expertiseStackRef = useRef(null)
  const [isLowEnd, setIsLowEnd] = useState(false)

  const handleSectionNavigation = (event) => {
    const href = event.currentTarget.getAttribute('href')
    if (!href || !href.startsWith('#')) {
      return
    }

    const target = document.querySelector(href)
    if (!target) {
      return
    }

    event.preventDefault()
    const navHeight = document.querySelector('.top-nav')?.getBoundingClientRect().height ?? 0
    const offset = -(navHeight + 24)

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset,
        duration: 1.05,
        easing: (value) => 1 - Math.pow(1 - value, 3),
      })
    } else {
      const targetTop = target.getBoundingClientRect().top + window.scrollY + offset
      window.scrollTo({ top: targetTop, behavior: 'smooth' })
    }

    if (window.location.hash !== href) {
      window.history.replaceState(null, '', href)
    }
  }

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      normalizeWheel: true,
    })
    lenisRef.current = lenis
    // Start stopped — unlock after intro transition completes
    lenis.stop()

    let rafId = 0
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    lenis.on('scroll', ScrollTrigger.update)

    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      splitRef.current = new SplitType('[data-split]', { types: 'chars' })

      gsap.set('.hero-title .char', {
        yPercent: 120,
        opacity: 0,
      })

      introTimelineRef.current = gsap
        .timeline({ paused: true, defaults: { ease: 'power3.out' } })
        .fromTo(
          '.top-nav',
          { y: -60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, immediateRender: false },
        )
        .to(
          '.hero-title .char',
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.026,
            duration: 0.85,
          },
          0.1,
        )
        .from('.hero-kicker', { y: 24, opacity: 0, duration: 0.6 }, 0.2)
        .from('.hero-copy', { y: 26, opacity: 0, duration: 0.65 }, 0.28)
        .from('.hero-actions .btn', { y: 28, opacity: 0, stagger: 0.08, duration: 0.6 }, 0.35)
        .from('.skill-pill', { y: 16, opacity: 0, stagger: 0.04, duration: 0.4 }, 0.48)
        .from('.status-pill', { scale: 0.82, opacity: 0, duration: 0.5 }, 0.55)

      gsap.utils.toArray('[data-reveal]').forEach((item) => {
        gsap.from(item, {
          y: 72,
          opacity: 0,
          duration: 1.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 82%',
            once: true,
          },
        })
      })

      gsap.utils.toArray('[data-float]').forEach((item) => {
        const depth = Number(item.getAttribute('data-float')) || 40
        gsap.to(item, {
          y: depth,
          ease: 'none',
          scrollTrigger: {
            trigger: '.page-shell',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        })
      })

      const setProjectsFocus = (isFocused) => {
        document.body.classList.toggle('projects-focused', isFocused)
      }

      // Always reset first in case class persisted through HMR/refresh during dev.
      setProjectsFocus(false)

      mm.add('(min-width: 900px)', () => {
        const track = document.querySelector('.work-track')
        const workPin = document.querySelector('.work-pin')
        if (!track || !workPin) {
          return
        }

        const getMaxShift = () =>
          Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.12)

        const getPinDistance = () => getMaxShift() + window.innerHeight * 0.6

        const horizontalST = gsap.to(track, {
          x: () => -getMaxShift(),
          ease: 'none',
          scrollTrigger: {
            trigger: workPin,
            start: 'top top',
            end: () => `+=${getPinDistance()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onToggle: (self) => {
              setProjectsFocus(self.isActive)
            },
          },
        })

        return () => {
          setProjectsFocus(false)
        }
      })

      gsap
        .timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: '.projects-section',
            start: 'top 78%',
            once: true,
          },
        })
        .from('.projects-heading h2', {
          y: 60,
          opacity: 0,
          duration: 0.85,
        })
        .from(
          '.projects-heading p',
          { y: 30, opacity: 0, duration: 0.55 },
          '-=0.5',
        )
        .from(
          '.projects-section .work-card',
          {
            y: 80,
            opacity: 0,
            scale: 0.96,
            stagger: 0.08,
            duration: 0.8,
          },
          '-=0.3',
        )

      gsap.to('.marquee__inner', {
        xPercent: -50,
        duration: 24,
        ease: 'none',
        repeat: -1,
      })

      // ── Overlap Parallax for all major sections ──
      const parallaxSections = [
        { sel: '.statement', speed: 0.12 },
        { sel: '.partners', speed: 0.1 },
        { sel: '.expertise-section', speed: 0.08 },
        { sel: '.contact', speed: 0.06 },
      ]

      parallaxSections.forEach(({ sel, speed }) => {
        const el = document.querySelector(sel)
        if (!el) return
        gsap.to(el, {
          yPercent: -speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    }, appRef)

    const magneticButton = magneticButtonRef.current
    const handleMove = (event) => {
      if (!magneticButton) {
        return
      }

      const bounds = magneticButton.getBoundingClientRect()
      const x = event.clientX - bounds.left - bounds.width / 2
      const y = event.clientY - bounds.top - bounds.height / 2

      gsap.to(magneticButton, {
        x: x * 0.24,
        y: y * 0.28,
        duration: 0.35,
        ease: 'power2.out',
      })
    }

    const handleLeave = () => {
      gsap.to(magneticButton, {
        x: 0,
        y: 0,
        duration: 0.55,
        ease: 'elastic.out(1, 0.45)',
      })
    }

    magneticButton?.addEventListener('mousemove', handleMove)
    magneticButton?.addEventListener('mouseleave', handleLeave)

    return () => {
      document.body.classList.remove('projects-focused')
      magneticButton?.removeEventListener('mousemove', handleMove)
      magneticButton?.removeEventListener('mouseleave', handleLeave)
      cancelAnimationFrame(rafId)
      lenisRef.current = null
      lenis.destroy()
      mm.revert()
      splitRef.current?.revert()
      ctx.revert()
    }
  }, [])

  // Low-end detection + expertise will-change management
  useEffect(() => {
    const lowEnd = getIsLowEnd()
    setIsLowEnd(lowEnd)
    if (lowEnd) return

    const stack = expertiseStackRef.current
    if (!stack) return

    const panels = stack.querySelectorAll('.expertise-panel:not(.expertise-panel--last)')
    if (!panels.length) return

    // IntersectionObserver: add will-change only to panels near the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.willChange = 'transform'
          } else {
            entry.target.style.willChange = 'auto'
          }
        })
      },
      { rootMargin: '100px 0px' },
    )

    panels.forEach((p) => observer.observe(p))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!experienceStarted) {
      document.body.classList.add('is-locked')
      gsap.set('.preloader', { autoAlpha: 1, pointerEvents: 'auto' })
      gsap.set('.preloader__panel', { yPercent: 0 })
      gsap.set('.smoke-overlay', { opacity: 0 })
      introTimelineRef.current?.pause(0)
      // Keep Lenis stopped while preloader is active
      lenisRef.current?.stop()
      return
    }

    // Ensure page is scrolled to top before transition
    window.scrollTo(0, 0)

    // --- REVERSE FLIP: animate the HERO title from the preloader's position ---
    // This keeps text at native resolution (no bitmap scaling blur)
    const preTitle = preloaderTitleRef.current
    const heroTitle = document.querySelector('.hero-title')
    if (!preTitle || !heroTitle) return

    const preRect = preTitle.getBoundingClientRect()
    const heroRect = heroTitle.getBoundingClientRect()

    // How much to scale the hero title DOWN so it matches the preloader title size
    const invertScale = preRect.width / heroRect.width

    // Where the preloader title center is relative to the hero title center
    const invertX = (preRect.left + preRect.width / 2) - (heroRect.left + heroRect.width / 2)
    const invertY = (preRect.top + preRect.height / 2) - (heroRect.top + heroRect.height / 2)

    const smokeEl = smokeRef.current
    const smokeRings = smokeEl?.querySelectorAll('.smoke-ring')

    // Prepare: show hero title at the preloader's position/size, hide preloader title
    gsap.set('.hero-title .char', { yPercent: 0, opacity: 1 })
    gsap.set('.hero-title', {
      visibility: 'visible',
      opacity: 1,
      scale: invertScale,
      x: invertX,
      y: invertY,
      transformOrigin: 'center center',
    })
    gsap.set(
      ['.top-nav', '.hero-kicker', '.hero-copy', '.hero-actions .btn', '.skill-pill', '.status-pill'],
      { opacity: 0, y: 24 },
    )

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        // Clean up: reset hero title inline transforms
        gsap.set('.hero-title', { clearProps: 'transform,x,y,scale,transformOrigin' })
        gsap.set('.preloader', { autoAlpha: 0, pointerEvents: 'none' })
        gsap.set('.smoke-overlay', { opacity: 0 })
        document.querySelector('.preloader__panel')?.classList.remove('panel--fading')
        document.querySelector('.preloader')?.classList.remove('preloader--fading')
        // Unlock scroll
        document.body.classList.remove('is-locked')
        lenisRef.current?.start()
      },
    })

    // ── PHASE 1 — DISSOLVE CARD (0 → 0.4s) ──
    // Fade out everything in the preloader (including the preloader h2 — hero title is now visible behind it)
    tl.to(
      ['.preloader__tag', '.preloader__note', '.preloader__meta', '.preloader__panel .btn'],
      { opacity: 0, duration: 0.3, ease: 'power2.out' },
      0,
    )
    // Fade out preloader title (hero title is already in its place)
    tl.to(preTitle, { opacity: 0, duration: 0.25, ease: 'power2.out' }, 0.15)
    // Dissolve card chrome
    tl.to(
      '.preloader__panel',
      {
        borderColor: 'rgba(255,255,255,0)',
        background: 'rgba(0,0,0,0)',
        boxShadow: '0 0 0 rgba(0,0,0,0)',
        duration: 0.35,
        ease: 'power2.out',
      },
      0,
    )
    tl.add(() => {
      document.querySelector('.preloader__panel')?.classList.add('panel--fading')
      document.querySelector('.preloader')?.classList.add('preloader--fading')
    }, 0)
    // Fade preloader backdrop
    tl.to(
      '.preloader',
      { background: 'rgba(3, 6, 16, 0)', backdropFilter: 'blur(0px)', duration: 0.45, ease: 'power2.out' },
      0.05,
    )

    // ── PHASE 2 — SMOKE + HERO TITLE SCALES TO NATIVE SIZE (0.2 → 0.9s) ──
    // Animate hero title from preloader position/size to its native position/size
    tl.to(
      '.hero-title',
      { scale: 1, x: 0, y: 0, duration: 0.7, ease: 'power2.inOut' },
      0.2,
    )

    // Smoke: GSAP-driven scale+opacity
    if (smokeRings && smokeRings.length) {
      tl.to(smokeEl, { opacity: 1, duration: 0.15 }, 0.25)

      smokeRings.forEach((ring, i) => {
        tl.fromTo(
          ring,
          { scale: 0, opacity: 0 },
          {
            scale: 2.5 + i * 0.5,
            opacity: 0.85,
            duration: 0.5,
            ease: 'power2.out',
          },
          0.28 + i * 0.06,
        )
        tl.to(
          ring,
          { opacity: 0, scale: 3 + i * 0.6, duration: 0.4, ease: 'power1.in' },
          0.55 + i * 0.05,
        )
      })

      tl.to(smokeEl, { opacity: 0, duration: 0.3, ease: 'power2.out' }, 0.8)
    }

    // ── PHASE 3 — HERO ELEMENTS STAGGER IN (0.7 → 1.4s) ──
    const heroEls = [
      document.querySelector('.top-nav'),
      document.querySelector('.hero-kicker'),
      document.querySelector('.hero-copy'),
      ...document.querySelectorAll('.hero-actions .btn'),
      ...document.querySelectorAll('.skill-pill'),
      document.querySelector('.status-pill'),
    ].filter(Boolean)

    heroEls.forEach((el, i) => {
      tl.to(
        el,
        { opacity: 1, y: 0, duration: 0.45, ease: 'power4.out' },
        0.75 + i * 0.07,
      )
    })

    return () => {
      document.body.classList.remove('is-locked')
    }
  }, [experienceStarted])

  return (
    <main className="page-shell" ref={appRef}>
      <div className="preloader" aria-hidden={experienceStarted}>
        <div className="preloader__panel">
          <p className="preloader__tag">Independent Creator Profile</p>
          <h2 ref={preloaderTitleRef}>HPX.DEV</h2>
          <p className="preloader__note">
            Full-stack developer, tech enthusiast, and photographer building seamless web and app
            experiences with an eye for detail.
          </p>
          <div className="preloader__meta" aria-hidden="true">
            <span>Code</span>
            <span>Design</span>
            <span>Photography</span>
          </div>
          <button className="btn btn--primary" onClick={() => setExperienceStarted(true)}>
            Enter portfolio
          </button>
        </div>
      </div>

      <div className="smoke-overlay" ref={smokeRef} aria-hidden="true">
        <div className="smoke-ring smoke-ring--1"></div>
        <div className="smoke-ring smoke-ring--2"></div>
        <div className="smoke-ring smoke-ring--3"></div>
      </div>

      <div className="ambient-layer" aria-hidden="true">
        <span className="orb orb--a" data-float="130"></span>
        <span className="orb orb--b" data-float="90"></span>
        <span className="orb orb--c" data-float="160"></span>
      </div>

      <div className="cinematic-mask" aria-hidden="true"></div>

      <header className="top-nav">
        <a href="#home" className="brand-mark" onClick={handleSectionNavigation}>
          <span className="brand-star"></span>
          <span>HPX.DEV</span>
        </a>
        <nav>
          <a href="#work" onClick={handleSectionNavigation}>Projects</a>
          <a href="#services" onClick={handleSectionNavigation}>Expertise</a>
          <a href="#contact" onClick={handleSectionNavigation}>Contact</a>
        </nav>
        <a href="mailto:yournamepleaseplease@gmail.com" className="status-pill">
          <span className="status-pill__dot"></span>
          AVAILABLE FOR NEW BUILDS
        </a>
      </header>

      <section className="section hero" id="home">
        <p className="hero-kicker">Full-stack developer, tech explorer, visual storyteller</p>
        <h1 className="hero-title" data-split>
          HPX.DEV
        </h1>
        <p className="hero-copy">
          I am Harmanpreet Singh, a full-stack developer who loves exploring every tech stack to craft seamless,
          high-performance websites and app experiences. I also bring a photographer&apos;s eye to
          every interface, balancing engineering precision with visual emotion.
        </p>
        <div className="hero-actions">
          <button className="btn btn--primary" ref={magneticButtonRef}>
            View projects
          </button>
          <a className="btn btn--ghost" href="#work" onClick={handleSectionNavigation}>
            See case studies
          </a>
        </div>
        <ul className="skills-row">
          {['Full-stack', 'React', 'Node.js', 'Cloud', 'Mobile UX', 'Photography'].map((skill) => (
            <li className="skill-pill" key={skill}>
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section className="section statement" data-reveal>
        <p>
          I build products that feel fast, look intentional, and tell stories users remember.
        </p>
      </section>

      <section className="projects-section" id="work">
        <div className="work-pin">
          <div className="section section-head projects-heading">
            <h2>Featured projects</h2>
            <p>
              Selected builds across SaaS, portfolios, and product platforms where engineering and
              design move as one.
            </p>
          </div>

          <div className="work-track">
            {workItems.map((item) => (
              <article
                className="work-card"
                key={item.title}
                style={{ '--card-gradient': item.gradient }}
              >
                <div className="work-card__visual">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <div className="work-card__body">
                  <p className="work-card__category">{item.category}</p>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <a href="#contact" onClick={handleSectionNavigation}>View case study</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section partners" data-reveal>
        <h2>Stack in daily rotation</h2>
        <p>Technologies and tools I rely on to ship polished digital experiences.</p>
        <div className="marquee" aria-label="Partner list">
          <div className="marquee__inner">
            {[...partnerNames, ...partnerNames].map((name, index) => (
              <span key={`${name}-${index}`}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`expertise-section ${isLowEnd ? 'expertise-section--static' : ''}`}
        id="services"
        ref={expertiseStackRef}
      >
        <div className="expertise-header" data-reveal>
          <h2>Capabilities</h2>
          <p>From product strategy to production-ready code and visual storytelling.</p>
        </div>

        <div className="expertise-stack">
          {expertisePanels.map((panel, i) => (
            <div
              className={`expertise-panel ${i === expertisePanels.length - 1 ? 'expertise-panel--last' : ''
                }`}
              key={panel.title}
              style={{
                '--panel-accent': panel.accent,
                '--panel-bg': panel.bg,
                zIndex: i + 1,
              }}
            >
              <div className="expertise-panel__inner">
                <div className="expertise-panel__left">
                  <span className="expertise-panel__number">{panel.number}</span>
                  <h3 className="expertise-panel__title">{panel.title}</h3>
                  <p className="expertise-panel__headline">{panel.headline}</p>
                  <p className="expertise-panel__desc">{panel.description}</p>
                  <div className="expertise-panel__skills">
                    {panel.skills.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                  <a href="#contact" className="expertise-panel__link" onClick={handleSectionNavigation}>
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                </div>
                <div className="expertise-panel__right" aria-hidden="true">
                  <div className="expertise-panel__visual">
                    <img src={panel.image} alt={panel.title} loading="lazy" />
                  </div>
                </div>
              </div>
              <span className="expertise-panel__big-word">{panel.title}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section contact" id="contact" data-reveal>
        <p className="contact-kicker">Let&apos;s build something sharp</p>
        <h2>I partner with teams that care about performance, craft, and memorable user impact.</h2>
        <a className="btn btn--primary" href="mailto:yournamepleaseplease@gmail.com">
          Get in touch
        </a>
        <div className="contact-meta">
          <a href="https://github.com/hpx07" target="_blank" rel="noopener noreferrer">
            Click for Github
          </a>
          <a
            href="https://www.google.com/maps?q=31.9502,75.6175"
            target="_blank"
            rel="noopener noreferrer"
          >
            31.9622° N, 75.6185° E, Panjab
          </a>
        </div>
      </section>
    </main>
  )
}

export default App
