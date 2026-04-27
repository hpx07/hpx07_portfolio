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
  },
  {
    title: 'StackPulse Console',
    category: 'SaaS Dashboard',
    summary:
      'A modern analytics workspace built with React and Node.js for real-time product and infrastructure insights.',
    gradient:
      'linear-gradient(130deg, #ffca80 0%, #ff6e7a 48%, #3b1639 100%)',
  },
  {
    title: 'Nomad Notes',
    category: 'Cross-platform PWA',
    summary:
      'An offline-ready writing app synchronized across devices with clean UX, smart search, and cloud backup.',
    gradient:
      'linear-gradient(140deg, #6af7c0 0%, #15b79a 50%, #11302d 100%)',
  },
  {
    title: 'Pixel Drift Stories',
    category: 'Visual Storytelling',
    summary:
      'A cinematic storytelling site mixing motion direction, typography, and photography to create high-impact narratives.',
    gradient:
      'linear-gradient(140deg, #ff9dd8 0%, #ff6979 45%, #2c1434 100%)',
  },
  {
    title: 'FlowOps Control Room',
    category: 'Developer Platform',
    summary:
      'A scalable full-stack control panel with role-based access, workflow automation, and observability-first architecture.',
    gradient:
      'linear-gradient(140deg, #9fd0ff 0%, #6b7bff 50%, #181f4b 100%)',
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

const stackColumns = [
  {
    title: 'Full-stack engineering',
    groups: [
      {
        label: 'Core stack',
        items: [
          'React / Next.js',
          'Node.js / Express',
          'TypeScript',
          'PostgreSQL + MongoDB',
          'REST + GraphQL',
          'Cloud architecture',
        ],
      },
      {
        label: 'Shipping style',
        items: [
          'Product-first delivery',
          'Performance budgets',
          'Scalable architecture',
          'CI / CD pipelines',
          'Observability and quality',
        ],
      },
    ],
  },
  {
    title: 'Creative direction',
    groups: [
      {
        label: 'Experience craft',
        items: [
          'Web and mobile UX / UI',
          'Design systems',
          'Motion-led interactions',
          'Brand-forward websites',
          'Micro-interaction design',
          'Creative prototyping',
        ],
      },
      {
        label: 'Photography',
        items: [
          'Portrait and lifestyle shoots',
          'Travel storytelling',
          'Color grading',
          'Social media visual packs',
        ],
      },
    ],
  },
]

function App() {
  const [experienceStarted, setExperienceStarted] = useState(false)
  const appRef = useRef(null)
  const magneticButtonRef = useRef(null)
  const introTimelineRef = useRef(null)
  const splitRef = useRef(null)
  const preloaderTitleRef = useRef(null)
  const smokeRef = useRef(null)
  const lenisRef = useRef(null)

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

        gsap.to(track, {
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
            start: 'top 72%',
            toggleActions: 'restart none none reverse',
          },
        })
        .from('.projects-heading h2', {
          y: 86,
          opacity: 0,
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.95,
        })
        .from(
          '.projects-heading p',
          {
            y: 36,
            opacity: 0,
            duration: 0.62,
          },
          '-=0.48',
        )
        .from(
          '.projects-section .work-card',
          {
            y: 110,
            opacity: 0,
            scale: 0.94,
            filter: 'blur(10px)',
            stagger: 0.1,
            duration: 0.9,
            clearProps: 'filter',
          },
          '-=0.2',
        )

      gsap.to('.marquee__inner', {
        xPercent: -50,
        duration: 24,
        ease: 'none',
        repeat: -1,
      })
    }, appRef)

    const inPageLinks = Array.from(document.querySelectorAll('a[href^="#"]')).filter((link) =>
      link.getAttribute('href')?.length > 1,
    )

    const handleAnchorNavigation = (event) => {
      const href = event.currentTarget.getAttribute('href')
      if (!href) {
        return
      }

      const target = document.querySelector(href)
      if (!target) {
        return
      }

      event.preventDefault()
      const navHeight = document.querySelector('.top-nav')?.getBoundingClientRect().height ?? 0

      lenis.scrollTo(target, {
        offset: -(navHeight + 24),
        duration: 1.05,
        easing: (value) => 1 - Math.pow(1 - value, 3),
      })
    }

    inPageLinks.forEach((link) => {
      link.addEventListener('click', handleAnchorNavigation)
    })

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
      inPageLinks.forEach((link) => {
        link.removeEventListener('click', handleAnchorNavigation)
      })
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
        <div className="brand-mark">
          <span className="brand-star"></span>
          <span>HPX.DEV</span>
        </div>
        <nav>
          <a href="#work">Projects</a>
          <a href="#services">Expertise</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="status-pill">
          <span className="status-pill__dot"></span>
          AVAILABLE FOR NEW BUILDS
        </div>
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
          <a className="btn btn--ghost" href="#work">
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
                <div className="work-card__visual" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p className="work-card__category">{item.category}</p>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <a href="#contact">Open case study</a>
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

      <section className="section services" id="services" data-reveal>
        <h2>Capabilities</h2>
        <p>From product strategy to production-ready code and visual storytelling.</p>
        <div className="services-grid">
          {stackColumns.map((column) => (
            <article className="service-card" key={column.title}>
              <h3>{column.title}</h3>
              {column.groups.map((group) => (
                <div className="service-group" key={group.label}>
                  <h4>{group.label}</h4>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </article>
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
