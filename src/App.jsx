import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import SplitType from 'split-type'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const workItems = [
  {
    title: 'Avalanche Nexus',
    category: 'Web3 Platform',
    summary:
      'Design and development for a blockchain gaming ecosystem with story-rich interactions.',
    gradient:
      'linear-gradient(140deg, #6ee7ff 0%, #2958ff 46%, #140f39 100%)',
  },
  {
    title: 'Guild Protocol',
    category: 'Campaign Site',
    summary:
      'A launch website with deep navigation transitions and modular game content.',
    gradient:
      'linear-gradient(130deg, #ffca80 0%, #ff6e7a 48%, #3b1639 100%)',
  },
  {
    title: 'Shrapnel Arena',
    category: 'Immersive Landing',
    summary:
      'High-contrast visuals and reactive sections built for competitive gameplay hype.',
    gradient:
      'linear-gradient(140deg, #6af7c0 0%, #15b79a 50%, #11302d 100%)',
  },
  {
    title: 'My Pet Havoc',
    category: 'Brand Experience',
    summary:
      'An energetic microsite blending playful motion, bold typography, and custom UI.',
    gradient:
      'linear-gradient(140deg, #ff9dd8 0%, #ff6979 45%, #2c1434 100%)',
  },
  {
    title: 'Gods Circuit',
    category: 'Game Narrative',
    summary:
      'A cinematic product journey with pinned scenes and layered card animations.',
    gradient:
      'linear-gradient(140deg, #9fd0ff 0%, #6b7bff 50%, #181f4b 100%)',
  },
]

const partnerNames = [
  'Immutable',
  'Avalanche',
  'PlayStation',
  'Ubisoft',
  'Nillion',
  'Shrapnel',
  'Metalcore',
  'KARRAT',
  'Stardust',
  'Pulsar',
]

const stackColumns = [
  {
    title: 'Software engineering',
    groups: [
      {
        label: 'Technology',
        items: ['React / Next.js', 'SvelteKit', 'Node.js', 'Rust', 'Golang', 'Web3'],
      },
      {
        label: 'Patterns',
        items: [
          'Test-driven development',
          'Event-driven architecture',
          'Microservices',
          'Atomic design',
          'Central state management',
        ],
      },
    ],
  },
  {
    title: 'Design',
    groups: [
      {
        label: 'Capabilities',
        items: [
          'Adaptive websites',
          'UX / UI',
          'Game interfaces',
          'Motion design',
          '3D + interaction design',
          'Social media content',
        ],
      },
      {
        label: 'Output',
        items: ['Visual identity', 'Custom iconography', 'Pitch deck visuals', 'Marketing reels'],
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

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      normalizeWheel: true,
    })

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
        .from('.top-nav', { y: -60, opacity: 0, duration: 0.8 })
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

      mm.add('(min-width: 900px)', () => {
        const track = document.querySelector('.work-track')
        if (!track) {
          return
        }

        const getMaxShift = () =>
          Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.12)

        gsap.to(track, {
          x: () => -getMaxShift(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.work-pin',
            start: 'top top',
            end: () => `+=${getMaxShift() + window.innerHeight * 0.6}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
      })

      mm.add('(max-width: 899px)', () => {
        gsap.from('.work-card', {
          y: 50,
          opacity: 0,
          stagger: 0.12,
          duration: 0.82,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.work-track',
            start: 'top 85%',
          },
        })
      })

      gsap.to('.marquee__inner', {
        xPercent: -50,
        duration: 24,
        ease: 'none',
        repeat: -1,
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
      introTimelineRef.current?.pause(0)
      return
    }

    document.body.classList.remove('is-locked')

    gsap.timeline({ defaults: { ease: 'power4.inOut' } })
      .to('.preloader__panel', { yPercent: -110, duration: 1.1 })
      .to('.preloader', { autoAlpha: 0, pointerEvents: 'none', duration: 0.2 }, '-=0.15')
      .add(() => {
        introTimelineRef.current?.play(0)
      })

    return () => {
      document.body.classList.remove('is-locked')
    }
  }, [experienceStarted])

  return (
    <main className="page-shell" ref={appRef}>
      <div className="preloader" aria-hidden={experienceStarted}>
        <div className="preloader__panel">
          <p className="preloader__tag">WonderForge Interactive</p>
          <h2>WONDER GAMES</h2>
          <button className="btn btn--primary" onClick={() => setExperienceStarted(true)}>
            Start loading
          </button>
        </div>
      </div>

      <div className="ambient-layer" aria-hidden="true">
        <span className="orb orb--a" data-float="130"></span>
        <span className="orb orb--b" data-float="90"></span>
        <span className="orb orb--c" data-float="160"></span>
      </div>

      <header className="top-nav">
        <div className="brand-mark">
          <span className="brand-star"></span>
          <span>WonderForge</span>
        </div>
        <nav>
          <a href="#work">Our work</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="status-pill">
          <span className="status-pill__dot"></span>
          AUDIO ONLINE 60 FPS
        </div>
      </header>

      <section className="section hero" id="home">
        <p className="hero-kicker">Your dedicated partner in the gaming industry</p>
        <h1 className="hero-title" data-split>
          WONDER GAMES
        </h1>
        <p className="hero-copy">
          You do not need a cheat code. You need a team that takes initiative, defends your
          product, and builds digital worlds players remember.
        </p>
        <div className="hero-actions">
          <button className="btn btn--primary" ref={magneticButtonRef}>
            Enter the game
          </button>
          <a className="btn btn--ghost" href="#work">
            Play demo
          </a>
        </div>
        <ul className="skills-row">
          {['Animation', '3D', 'Website', 'Web3', 'Game UX/UI'].map((skill) => (
            <li className="skill-pill" key={skill}>
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section className="section statement" data-reveal>
        <p>
          Our job is simple: craft digital experiences that take players far beyond what they
          came for.
        </p>
      </section>

      <section className="section section-head" id="work" data-reveal>
        <h2>Our work</h2>
        <p>
          Motion-first campaign websites and product experiences for game studios, publishers, and
          Web3 platforms.
        </p>
      </section>

      <section className="work-pin">
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
              <a href="#contact">Learn more</a>
            </article>
          ))}
        </div>
      </section>

      <section className="section partners" data-reveal>
        <h2>We partner with industry leaders</h2>
        <p>Their trust in our capabilities makes us super proud.</p>
        <div className="marquee" aria-label="Partner list">
          <div className="marquee__inner">
            {[...partnerNames, ...partnerNames].map((name, index) => (
              <span key={`${name}-${index}`}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section services" id="services" data-reveal>
        <h2>Services</h2>
        <p>You have one quest. We make it count.</p>
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
        <p className="contact-kicker">Let&apos;s join forces</p>
        <h2>As long as there is room to turn things up a notch, we are in.</h2>
        <a className="btn btn--primary" href="mailto:team@wonderforge.games">
          Get in touch
        </a>
        <div className="contact-meta">
          <a href="mailto:team@wonderforge.games">team@wonderforge.games</a>
          <span>Prague, Czech Republic</span>
        </div>
      </section>
    </main>
  )
}

export default App
