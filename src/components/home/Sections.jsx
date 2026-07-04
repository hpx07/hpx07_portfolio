// Home page sections — each one is a small, independent server component.
import Link from 'next/link'
import PostCard from '@/components/PostCard'
import PlanGrid from '@/components/PlanGrid'
import ContactForm from '@/components/ContactForm'
import HorizontalProjects from '@/components/home/HorizontalProjects'

// Brand accent per technology — drives the tinted monogram tile in the
// "Worked with" logo wall. Any skill can override the tile with a real
// uploaded logo (skill.icon) from Admin → Skills. Unknown names fall back
// to the ember accent. Kept inline (no icon dependency / no network) so the
// wall stays instant on low-end devices.
const BRAND = {
  javascript: '#f7df1e', typescript: '#3178c6', php: '#787cb5', sql: '#00758f',
  mysql: '#4479a1', mariadb: '#5a86a0', react: '#61dafb', 'next.js': 'var(--ink)',
  'node.js': '#5fa04e', express: 'var(--ink)', gsap: '#0ae448', capacitor: '#119eff',
  'capacitor.js': '#119eff', 'android studio': '#3ddc84', photoshop: '#31a8ff',
  lightroom: '#4ea7ff', 'git & ci': '#f05032', git: '#f05032', claude: '#d97757',
  copilot: 'var(--ink)', html: '#e34f26', css: '#1572b6', 'socket.io': 'var(--ink)',
  bootstrap: '#7952b3', python: '#4b8bbe', 'youtube api': '#ff0000',
}

function SkillChip({ skill }) {
  const brand = BRAND[String(skill.name || '').toLowerCase()] || 'var(--amber)'
  return (
    <span className="logo-chip" style={{ '--brand': brand }}>
      <span className="logo-mark">
        {skill.icon ? (
          <img src={skill.icon} alt="" loading="lazy" />
        ) : (
          String(skill.name || '?').trim().charAt(0).toUpperCase()
        )}
      </span>
      <span className="logo-name">{skill.name}</span>
    </span>
  )
}

export function Statement({ settings }) {
  return (
    <section className="section-tight statement">
      <div className="wrap">
        <p data-reveal="clip">
          {settings.statement.split('fast').length > 1 ? (
            <>
              {settings.statement.split('fast')[0]}
              <em>fast</em>
              {settings.statement.split('fast').slice(1).join('fast')}
            </>
          ) : (
            settings.statement
          )}
        </p>
      </div>
    </section>
  )
}

// Two logo rows scrolling in opposite directions (à la pulze.io's
// "works with the tools you already use"). Pure-CSS marquees. Each row
// carries the FULL skill list (row B reversed), tiled twice per loop-half so
// the belt is endless with no gap even on ultra-wide screens; both freeze
// under reduced-motion / low-end (data-fx="lite") via the global gate.
export function WorkedWith({ skills = [] }) {
  if (!skills.length) return null
  const rowA = [...skills, ...skills]
  const rowB = [...skills, ...skills].reverse()

  return (
    <section className="section-tight worked" id="worked">
      <div className="wrap">
        <div className="worked-head" data-reveal>
          <span className="kicker">Toolbox</span>
          <h2>Worked with the tools <em>that ship</em></h2>
          <p>The stack behind every build — from first commit to production monitoring.</p>
        </div>
      </div>
      <div className="logowall" aria-hidden="true">
        <div className="logo-row">
          <div className="logo-track">
            {[...rowA, ...rowA].map((s, i) => (
              <SkillChip key={`a-${s.id || s.name}-${i}`} skill={s} />
            ))}
          </div>
        </div>
        <div className="logo-row">
          <div className="logo-track rev">
            {[...rowB, ...rowB].map((s, i) => (
              <SkillChip key={`b-${s.id || s.name}-${i}`} skill={s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Stats({ stats }) {
  return (
    <section className="section-tight">
      <div className="wrap">
        <div className="stat-grid" data-reveal>
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ProjectsPreview({ projects }) {
  return <HorizontalProjects projects={projects} />
}

export function TechStack({ skills }) {
  const byCategory = skills.reduce((acc, s) => {
    ;(acc[s.category] ||= []).push(s)
    return acc
  }, {})
  return (
    <section className="section" id="stack">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="kicker" data-reveal>02 — Tools & technologies</span>
            <h2 data-reveal>The stack in <em>daily rotation</em></h2>
          </div>
        </div>
        <div className="tech-cats">
          {Object.entries(byCategory).map(([cat, items], i) => (
            <div className="tech-cat" key={cat} data-reveal style={{ '--reveal-delay': `${i * 0.08}s` }}>
              <h3>{cat}</h3>
              {items.map((s) => (
                <div className="tech-row" key={s.name}>
                  <span className="name">{s.name}</span>
                  <span className="tech-meter" aria-label={`${s.level}%`}>
                    <i style={{ '--lvl': Number(s.level) / 100 }} />
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Process({ steps }) {
  return (
    <section className="section" id="process">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="kicker" data-reveal>03 — How I work</span>
            <h2 data-reveal>A process built on <em>accountability</em></h2>
          </div>
        </div>
        <div className="process-grid">
          {steps.map((s, i) => (
            <div className="step-card" key={s.step} data-reveal style={{ '--reveal-delay': `${i * 0.09}s` }}>
              <span className="num">{s.step}</span>
              <h3>{s.title}</h3>
              <p>{s.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PlansPreview({ plans }) {
  return (
    <section className="section" id="plans">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="kicker" data-reveal>04 — Plans</span>
            <h2 data-reveal>Transparent pricing, <em>no surprises</em></h2>
          </div>
          <Link href="/plans" className="section-link" data-reveal>Compare plans →</Link>
        </div>
        <PlanGrid plans={plans} />
      </div>
    </section>
  )
}

export function Testimonials({ testimonials }) {
  if (!testimonials.length) return null
  return (
    <section className="section" id="voices">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="kicker" data-reveal>05 — Trust</span>
            <h2 data-reveal>What partners <em>say after launch</em></h2>
          </div>
        </div>
        <div className="tsl-grid">
          {testimonials.map((t, i) => (
            <figure className="tsl-card" key={t.id || t.author} data-reveal style={{ '--reveal-delay': `${i * 0.09}s` }}>
              <span className="tsl-stars" aria-label={`${t.rating} out of 5`}>
                {'★'.repeat(Number(t.rating) || 5)}
              </span>
              <blockquote>{t.quote}</blockquote>
              <figcaption className="tsl-who">
                <b>{t.author}</b>
                <span>{[t.role, t.company].filter(Boolean).join(' · ')}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BlogPreview({ posts }) {
  return (
    <section className="section" id="writing">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="kicker" data-reveal>06 — Tips & writing</span>
            <h2 data-reveal>Notes from the <em>workbench</em></h2>
          </div>
          <Link href="/blog" className="section-link" data-reveal>All articles →</Link>
        </div>
        <div className="post-grid">
          {posts.map((p, i) => (
            <PostCard key={p.slug} post={p} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function Faq({ faqs }) {
  if (!faqs.length) return null
  return (
    <section className="section" id="faq">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="kicker" data-reveal>07 — Straight answers</span>
            <h2 data-reveal>Questions clients <em>actually ask</em></h2>
          </div>
        </div>
        <div className="faq-list" data-reveal>
          {faqs.map((f) => (
            <details className="faq-item" key={f.id || f.question}>
              <summary>{f.question}</summary>
              <div className="faq-a">{f.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ContactSection({ settings, socials = [], presetPlan = '' }) {
  return (
    <section className="section" id="contact">
      <div className="wrap">
        <div className="contact-panel" data-reveal="scale">
          <div>
            <span className="kicker">08 — Contact</span>
            <h2>Let&apos;s build something <em>sharp.</em></h2>
            <div className="contact-meta">
              <a href={`mailto:${settings.contact_email}`}>✉ {settings.contact_email}</a>
              <span>◈ {settings.location_label} — remote worldwide</span>
              {socials
                .filter((s) => s.url?.startsWith('http'))
                .map((s) => (
                  <a key={s.id || s.url} href={s.url} target="_blank" rel="noopener noreferrer">
                    ↗ {s.label}
                  </a>
                ))}
            </div>
          </div>
          <ContactForm presetPlan={presetPlan} />
        </div>
      </div>
    </section>
  )
}
