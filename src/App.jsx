import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import SplitType from 'split-type'
import FloatingLines from '@/components/FloatingLines/FloatingLines'
import SplashCursor from '@/components/SplashCursor'
import GhostCursor from '@/components/GhostCursor/GhostCursor'
import Antigravity from '@/components/Antigravity'
import Silk from '@/components/Silk'
import { ExpandableProjectCards } from '@/components/ExpandableProjectCards'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const normalizeHex = (value) => {
  if (!value) return '#000000'
  const trimmed = String(value).replace('#', '').trim()
  if (trimmed.length === 3) {
    return `#${trimmed.split('').map((char) => char + char).join('')}`
  }
  if (trimmed.length === 6) {
    return `#${trimmed}`
  }
  return '#000000'
}

const hexToRgb = (value) => {
  const hex = normalizeHex(value).slice(1)
  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)
  return { r, g, b }
}

const hexToNormalizedRgb = (value) => {
  const { r, g, b } = hexToRgb(value)
  return { r: r / 255, g: g / 255, b: b / 255 }
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const getLuminance = ({ r, g, b }) => {
  const toLinear = (channel) => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  const rLinear = toLinear(r)
  const gLinear = toLinear(g)
  const bLinear = toLinear(b)
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
}

const mixHex = (from, to, weight = 0.5) => {
  const a = hexToRgb(from)
  const b = hexToRgb(to)
  const w = clamp(weight, 0, 1)
  const mix = (start, end) => Math.round(start * (1 - w) + end * w)
  const r = mix(a.r, b.r)
  const g = mix(a.g, b.g)
  const bValue = mix(a.b, b.b)
  return `#${[r, g, bValue].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

const buildThemeTokens = (theme) => {
  const base = normalizeHex(theme.base)
  const accent = normalizeHex(theme.accent)
  const baseLum = getLuminance(hexToRgb(base))
  const isLightBase = baseLum > 0.58
  const accentMixA = theme.accentMixA ?? (isLightBase ? 0.45 : 0.3)
  const accentMixB = theme.accentMixB ?? (isLightBase ? 0.68 : 0.55)
  const accent2 = normalizeHex(theme.accent2 ?? mixHex(accent, base, accentMixA))
  const accent3 = normalizeHex(theme.accent3 ?? mixHex(accent, base, accentMixB))
  const ink = normalizeHex(
    theme.ink ?? (isLightBase ? accent : mixHex('#ffffff', accent, 0.12)),
  )
  return { base, accent, accent2, accent3, ink }
}

const featuredProjects = [
  {
    title: 'Diet-N-Health Tracker',
    category: 'Mobile Application',
    description:
      'A comprehensive mobile health and nutrition tracking application with diet logging, health monitoring, and analytics built for offline-first mobile experiences.',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=80',
    technologies: ['React','React Router', 'Capacitor', 'Recharts','LocalStorage','Supabase'],
    problems: [
      'Offline-first mobile app with native Android experience',
      'Comprehensive nutrition tracking with dietary filters',
      'Real-time health data visualization and analytics',
    ],
  },
  {
    title: 'XP-Player',
    category: 'Mobile Application',
    description:
      'A modern, feature-rich Android music player with YouTube integration, background playback, playlist management, and lock screen controls.',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80',
    technologies: ['React', 'Vite', 'Capacitor.js', 'Custom Proxy Server', 'Invidious API', 'Youtube API'],
    problems: [
      'Can play any YouTube video as audio with background playback',
      'Multiple player theme and accent color options, basically a personal APP',
      'Multiple playback modes including shuffle, repeat, and smart queue generation',
    ],
  },
  {
    title: 'Multiplayer Games',
    category: 'Game Development',
    description:
      'A collection of real-time multiplayer games including Tic-Tac-Toe, Bingo, and Dots and Boxes, playable across network with live gameplay synchronization. Hosted on own pi server so it can be down right now.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
    technologies: ['HTML', 'JavaScript', 'Batch Script', 'Network Sockets', 'Real-time Sync'],
    problems: [
      'Real-time game state synchronization across network players',
      'Multiple game modes in single platform',
      'Low-latency move validation and turn management for seamless gameplay',
    ],
  },
  {
    title: 'LX Encrypted Chat',
    category: 'Web Application',
    description:
      'Secure, encrypted messaging platform with friend request system, real-time status, image sharing, and end-to-end encryption for private communications. Hosted on own pi server so it can be down right now.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    technologies: ['Node.js', 'Express', 'Socket.io', 'MariaDB', 'Crypto-JS', 'bcryptjs'],
    problems: [
      'End-to-end AES encryption for secure messaging',
      'Friend request system to control privacy and access',
      'Real-time chat with image sharing and persistent storage',
    ],
  },
  {
    title: 'SERP',
    category: 'ERP System',
    description:
      'A custom ERP system for a Major Healthcare Franchise Provider company, featuring Sales tracking, CRM and too many other features to streamline operations.', 
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
    technologies: ['PHP', 'MySQL', 'Node.js', 'JavaScript','REST APIs', 'Bootstrap'], 
    problems: [
      'Integrated with Tally for real-time Voucher Report and Entry',
      'Checks for Vacant area for Franchise appointments',
      'High reliability requirements for critical business operations',
    ],
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

const backgroundOptions = [
  { value: 'none', label: 'None' },
  { value: 'floating-lines', label: 'Floating Lines' },
  { value: 'splash-cursor', label: 'Splash Cursor' },
  { value: 'ghost-cursor', label: 'Ghost Cursor' },
  { value: 'antigravity', label: 'Antigravity' },
  { value: 'silk', label: 'Silk' },
]

const themeOptions = [
  {
    value: 'classic',
    label: 'Classic',
    base: '#010208',
    accent: '#4aa7ff',
    accent2: '#8aa3ff',
    accent3: '#1f305e',
    ink: '#f5f7ff',
  },
  {
    value: 'night-kiwi',
    label: 'Night Kiwi',
    base: '#222222',
    accent: '#89e900',
    accent2: '#b7ff4b',
    accent3: '#4a6500',
    ink: '#f2ffe0',
  },
  {
    value: 'ghost-persian',
    label: 'Ghost Persian',
    base: '#27187e',
    accent: '#f7f7ff',
    accent2: '#d7d5ff',
    accent3: '#4a3bb6',
    ink: '#f7f7ff',
  },
  {
    value: 'imperial-night',
    label: 'Imperial Night',
    base: '#000f08',
    accent: '#fb3640',
    accent2: '#ff6670',
    accent3: '#6a0c16',
    ink: '#ffe8ea',
  },
  {
    value: 'sand-cyprus',
    label: 'Sand Cyprus',
    base: '#f0ede5',
    accent: '#004643',
    accent2: '#2f7b75',
    accent3: '#88b6ae',
    ink: '#004643',
  },
  {
    value: 'milk-plum',
    label: 'Milk Plum',
    base: '#fff3e6',
    accent: '#381932',
    accent2: '#6c3a57',
    accent3: '#d8b6c6',
    ink: '#381932',
  },
]

const githubProjectsUrl = 'https://github.com/hpx07?tab=repositories'

const projectCards = featuredProjects.map((project) => ({
  title: project.title,
  description: project.category,
  src: project.image,
  ctaText: 'View repo',
  ctaLink: githubProjectsUrl,
  content: () => (
    <div className="flex flex-col gap-4">
      <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
        {project.description}
      </p>
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Technologies</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 text-[0.65rem] uppercase tracking-[0.12em] text-neutral-600 dark:text-neutral-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Problems solved</p>
        <ul className="flex flex-col gap-2 text-neutral-600 dark:text-neutral-300 text-sm">
          {project.problems.map((problem) => (
            <li key={problem}>{problem}</li>
          ))}
        </ul>
      </div>
    </div>
  ),
}))

const expertisePanels = [
  {
    number: '01',
    title: 'Design',
    headline: 'Interfaces that feel alive',
    description:
      'From wireframes to polished prototypes, I craft digital experiences where every pixel has purpose — balancing aesthetics with usability to create interfaces users love.',
    skills: ['UI / UX Design', 'Design Systems', 'Motion & Interactions', 'Prototyping', 'Brand Identity'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=600&fit=crop',
  },
  {
    number: '02',
    title: 'Engineering',
    headline: 'Code that scales and ships',
    description:
      'I build full-stack applications with clean architecture, type-safe code, and production-hardened infrastructure — engineered for performance under real-world pressure.',
    skills: ['React / Next.js', 'Node.js / Express', 'TypeScript', 'Cloud & CI/DI', 'API Design'],
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=600&fit=crop',
  },
  {
    number: '03',
    title: 'Strategy',
    headline: 'Vision into execution',
    description:
      'I connect business goals to technical roadmaps. Every project starts with understanding the "why" — then mapping the fastest path from concept to shipped product.',
    skills: ['Product Strategy', 'Technical Architecture', 'Performance Optimization', 'Growth Engineering'],
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
  const [introProgress, setIntroProgress] = useState(0)
  const [introPhase, setIntroPhase] = useState('loading')
  const appRef = useRef(null)
  const cursorLightRef = useRef(null)
  const magneticButtonRef = useRef(null)
  const introTimelineRef = useRef(null)
  const splitRef = useRef(null)
  const preloaderTitleRef = useRef(null)
  const smokeRef = useRef(null)
  const lenisRef = useRef(null)
  const expertiseStackRef = useRef(null)
  const flipTimeoutRef = useRef(null)
  const [isLowEnd, setIsLowEnd] = useState(false)
  const [themeChoice, setThemeChoice] = useState('classic')
  const [backgroundChoice, setBackgroundChoice] = useState('none')
  const [showSettings, setShowSettings] = useState(false)
  const activeTheme = themeOptions.find((theme) => theme.value === themeChoice) ?? themeOptions[0]
  const themeTokens = useMemo(() => buildThemeTokens(activeTheme), [activeTheme])
  const introIsRevealed = introPhase === 'reveal'
  const preloaderClassName = `preloader ${introIsRevealed ? 'preloader--reveal' : 'preloader--loading'}`

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
    const root = document.documentElement
    root.dataset.theme = activeTheme.value
    root.style.setProperty('--theme-base', themeTokens.base)
    root.style.setProperty('--theme-ink', themeTokens.ink)
    root.style.setProperty('--theme-accent', themeTokens.accent)
    root.style.setProperty('--theme-accent-2', themeTokens.accent2)
    root.style.setProperty('--theme-accent-3', themeTokens.accent3)
  }, [
    activeTheme.value,
    themeTokens.base,
    themeTokens.ink,
    themeTokens.accent,
    themeTokens.accent2,
    themeTokens.accent3,
  ])

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
          '.projects-card-item',
          {
            y: 50,
            opacity: 0,
            stagger: 0.07,
            duration: 0.6,
          },
          '-=0.3',
        )
        .from(
          '.projects-card-list',
          {
            y: 30,
            opacity: 0,
            duration: 0.5,
          },
          '-=0.35',
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
      magneticButton?.removeEventListener('mousemove', handleMove)
      magneticButton?.removeEventListener('mouseleave', handleLeave)
      cancelAnimationFrame(rafId)
      if (flipTimeoutRef.current) {
        window.clearTimeout(flipTimeoutRef.current)
      }
      lenisRef.current = null
      lenis.destroy()
      splitRef.current?.revert()
      ctx.revert()
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const cursorLight = cursorLightRef.current
    if (!cursorLight) {
      return
    }

    const supportsFinePointer = window.matchMedia('(pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!supportsFinePointer || prefersReducedMotion) {
      return
    }

    const xTo = gsap.quickTo(cursorLight, 'x', { duration: 0.22, ease: 'power3.out' })
    const yTo = gsap.quickTo(cursorLight, 'y', { duration: 0.22, ease: 'power3.out' })

    const handlePointerMove = (event) => {
      cursorLight.classList.add('cursor-soft-light--visible')
      xTo(event.clientX)
      yTo(event.clientY)
    }

    const handlePointerOut = (event) => {
      if (event.relatedTarget) {
        return
      }

      cursorLight.classList.remove('cursor-soft-light--visible')
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerout', handlePointerOut)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerout', handlePointerOut)
    }
  }, [])

  useEffect(() => {
    if (!experienceStarted) {
      return
    }

    document.body.classList.toggle('is-locked', showSettings)
    return () => {
      document.body.classList.remove('is-locked')
    }
  }, [showSettings, experienceStarted])

  useEffect(() => {
    if (!showSettings) {
      return
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowSettings(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSettings])

  useEffect(() => {
    if (experienceStarted) {
      return
    }

    let rafId = 0
    let revealTimeout = 0
    const durationMs = 1000
    const start = performance.now()

    setIntroPhase('loading')
    setIntroProgress(0)

    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min((elapsed / durationMs) * 100, 100)
      setIntroProgress(progress)

      if (progress < 100) {
        rafId = requestAnimationFrame(tick)
      } else {
        setIntroPhase('reveal')
        revealTimeout = window.setTimeout(() => {
          setExperienceStarted(true)
        }, 3000)
      }
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      if (revealTimeout) {
        window.clearTimeout(revealTimeout)
      }
    }
  }, [experienceStarted])

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
      gsap.set('.preloader__panel', { clearProps: 'transform' })
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
      ['.preloader__loading', '.preloader__panel > :not(h2)'],
      { opacity: 0, duration: 0.85, ease: 'power2.out' },
      0,
    )
    // Fade out preloader title (hero title is already in its place)
    tl.to(preTitle, { opacity: 0, duration: 0.6, ease: 'power2.out' }, 0.15)
    // Dissolve card chrome
    tl.to(
      '.preloader__panel',
      {
        borderColor: 'rgba(255,255,255,0)',
        background: 'rgba(0,0,0,0)',
        boxShadow: '0 0 0 rgba(0,0,0,0)',
        duration: 0.6,
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
      { background: 'rgba(3, 6, 16, 0)', backdropFilter: 'blur(0px)', duration: 1.4, ease: 'power2.out' },
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
      <div className="cursor-soft-light" ref={cursorLightRef} aria-hidden="true"></div>

      {backgroundChoice === 'floating-lines' && (
        <div className="floating-lines-bg" aria-hidden="true">
          <div
            className="floating-lines-bg__inner"
            style={{
              width: 'max(1080px, 120vmax)',
              height: 'max(1080px, 120vmax)',
              position: 'relative',
            }}
          >
            <FloatingLines
              linesGradient={[themeTokens.accent3, themeTokens.accent2, themeTokens.accent3]}
              animationSpeed={1.7}
              interactive
              bendRadius={5}
              bendStrength={-0.5}
              mouseDamping={0.05}
              parallax
              parallaxStrength={0.2}
            />
          </div>
        </div>
      )}

      {backgroundChoice === 'splash-cursor' && (
        <div className="splash-cursor-bg" aria-hidden="true">
          <div
            className="splash-cursor-bg__inner"
            style={{
              width: 'max(1080px, 120vmax)',
              height: 'max(1080px, 120vmax)',
              position: 'relative',
            }}
          >
            <SplashCursor
              SIM_RESOLUTION={128}
              DYE_RESOLUTION={1536}
              DENSITY_DISSIPATION={4}
              VELOCITY_DISSIPATION={2}
              PRESSURE={0.2}
              CURL={3}
              SPLAT_RADIUS={0.2}
              SPLAT_FORCE={6000}
              COLOR_UPDATE_SPEED={10}
              COLOR={themeTokens.accent}
              RAINBOW_MODE={false}
              BACK_COLOR={hexToNormalizedRgb(themeTokens.base)}
            />
          </div>
        </div>
      )}

      {backgroundChoice === 'ghost-cursor' && (
        <div className="ghost-cursor-bg" aria-hidden="true">
          <div
            className="ghost-cursor-bg__inner"
            style={{
              width: 'max(1080px, 120vmax)',
              height: 'max(1080px, 120vmax)',
              position: 'relative',
            }}
          >
            <GhostCursor
              trailLength={50}
              inertia={0.2}
              grainIntensity={0.05}
              bloomStrength={0.05}
              bloomRadius={0.2}
              brightness={0.5}
              color={themeTokens.accent2}
              edgeIntensity={0.7}
              zIndex={-3}
            />
          </div>
        </div>
      )}

      {backgroundChoice === 'antigravity' && (
        <div className="antigravity-bg" aria-hidden="true">
          <div
            className="antigravity-bg__inner"
            style={{
              width: 'max(1080px, 120vmax)',
              height: 'max(1080px, 120vmax)',
              position: 'relative',
            }}
          >
            <Antigravity
              count={540}
              magnetRadius={16}
              ringRadius={3}
              waveSpeed={0.4}
              waveAmplitude={0.8}
              particleSize={0.4}
              lerpSpeed={0.1}
              color={themeTokens.accent}
              particleVariance={2.6}
              rotationSpeed={0}
              depthFactor={2}
              pulseSpeed={3}
              particleShape="tetrahedron"
              fieldStrength={10}
              useWindowPointer
            />
          </div>
        </div>
      )}

      {backgroundChoice === 'silk' && (
        <div className="silk-bg" aria-hidden="true">
          <div
            className="silk-bg__inner"
            style={{
              width: 'max(1080px, 120vmax)',
              height: 'max(1080px, 120vmax)',
              position: 'relative',
            }}
          >
            <Silk
              speed={5}
              scale={1.5}
              color={themeTokens.accent3}
              noiseIntensity={1.1}
              rotation={0}
            />
          </div>
        </div>
      )}

      <div className={preloaderClassName} aria-hidden={experienceStarted}>
        <div className="preloader__loading" aria-hidden={introIsRevealed}>
          <div
            className="preloader__loading-track"
            role="progressbar"
            aria-valuenow={Math.round(introProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Loading intro"
          >
            <span
              className="preloader__loading-bar"
              style={{ transform: `scaleX(${introProgress / 100})` }}
            ></span>
          </div>
          <p className="preloader__loading-label">Loading experience</p>
        </div>
        <div className="preloader__panel preloader__panel--intro" aria-hidden={!introIsRevealed}>
          <div className="preloader__header">
            <p className="preloader__tag">Independent Creator Profile</p>
          </div>
          <h2 ref={preloaderTitleRef}>HPX.DEV</h2>
          <div className="preloader__divider" aria-hidden="true"></div>
          <div className="preloader__stats preloader__stats--intro" aria-hidden="true">
            <div>
              <span>Focus</span>
              <strong>Full-stack</strong>
            </div>
            <div>
              <span>Mode</span>
              <strong>Design + Code</strong>
            </div>
            <div>
              <span>Based</span>
              <strong>Panjab, IN</strong>
            </div>
          </div>
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
        <div className="top-nav__actions">
          <button
            className="settings-btn"
            type="button"
            onClick={() => setShowSettings(true)}
            aria-haspopup="dialog"
            aria-expanded={showSettings}
          >
            Settings
          </button>
          <a href="mailto:yournamepleaseplease@gmail.com" className="status-pill">
            <span className="status-pill__dot"></span>
            AVAILABLE FOR NEW BUILDS
          </a>
        </div>
      </header>

      {showSettings && (
        <div className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
          <div className="settings-modal__backdrop" onClick={() => setShowSettings(false)}></div>
          <div className="settings-modal__panel">
            <div className="settings-modal__header">
              <h2 id="settings-title">Settings</h2>
              <button
                type="button"
                className="settings-modal__close"
                onClick={() => setShowSettings(false)}
              >
                Close
              </button>
            </div>
            <div className="settings-modal__body">
              <label className="settings-field">
                <span>Theme</span>
                <select
                  value={themeChoice}
                  onChange={(event) => setThemeChoice(event.target.value)}
                >
                  {themeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="settings-field">
                <span>Background</span>
                <select
                  value={backgroundChoice}
                  onChange={(event) => setBackgroundChoice(event.target.value)}
                >
                  {backgroundOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <p className="settings-modal__hint">More backgrounds coming soon.</p>
            </div>
          </div>
        </div>
      )}

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
        <div className="section section-head projects-heading">
          <h2>Featured projects</h2>
          <p>
            Selected builds across SaaS, portfolios, and product platforms where engineering and
            design move as one.
          </p>
        </div>
        <div className="section">
          <ExpandableProjectCards cards={projectCards} />
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
          {expertisePanels.map((panel, i) => {
            const panelIndex = i + 1
            return (
              <div
                className={`expertise-panel ${i === expertisePanels.length - 1 ? 'expertise-panel--last' : ''
                  }`}
                key={panel.title}
                style={{
                  '--panel-accent': `var(--panel-accent-${panelIndex})`,
                  '--panel-bg': `var(--panel-bg-${panelIndex})`,
                  zIndex: panelIndex,
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
            )
          })}
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
