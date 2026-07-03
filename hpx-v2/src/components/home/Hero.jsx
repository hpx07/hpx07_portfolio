import Link from 'next/link'
import HeroFluid from '@/components/HeroFluid'

function TitleWithAccent({ title, accent }) {
  if (!accent || !title.includes(accent)) return <>{title}</>
  const idx = title.lastIndexOf(accent)
  return (
    <>
      {title.slice(0, idx)}
      <em>{accent}</em>
      {title.slice(idx + accent.length)}
    </>
  )
}

export default function Hero({ settings }) {
  return (
    <section className="hero" id="top">
      <HeroFluid />

      {/* floating parallax chips — drift at different speeds, reverse on scroll-up */}
      <span className="prlx-chip" data-prlx="0.32" style={{ top: '18%', right: '8%' }}>
        {settings.location_coords}
      </span>
      <span className="prlx-chip" data-prlx="0.18" style={{ top: '32%', right: '20%' }}>
        EST. HPX STUDIO
      </span>
      <span className="prlx-chip" data-prlx="0.26" style={{ bottom: '26%', right: '12%' }}>
        LIGHTHOUSE 95+
      </span>
      <span className="prlx-chip" data-prlx="0.4" style={{ bottom: '38%', right: '30%' }}>
        DESIGN × CODE
      </span>

      <div className="wrap hero-inner">
        <p className="hero-kicker kicker" data-reveal>{settings.hero_kicker}</p>
        <h1 className="hero-title" data-reveal style={{ '--reveal-delay': '0.08s' }}>
          <TitleWithAccent title={settings.hero_title} accent={settings.hero_accent_word} />
        </h1>
        <p className="hero-copy" data-reveal style={{ '--reveal-delay': '0.16s' }}>
          {settings.hero_copy}
        </p>
        <div className="hero-actions" data-reveal style={{ '--reveal-delay': '0.24s' }}>
          <Link href="/projects" className="btn btn-ember">View projects</Link>
          <Link href="/plans" className="btn btn-ghost">See plans</Link>
        </div>
        <div className="hero-meta" data-reveal style={{ '--reveal-delay': '0.32s' }}>
          <div>
            <span className="label">Founder</span>
            <span className="value">{settings.site_owner}</span>
          </div>
          <div>
            <span className="label">Focus</span>
            <span className="value">Full-stack · Web & Android</span>
          </div>
          <div>
            <span className="label">Based</span>
            <span className="value">{settings.location_label}</span>
          </div>
          <div>
            <span className="label">Status</span>
            <span className="value">{settings.availability}</span>
          </div>
        </div>
      </div>
      <div className="wrap">
        <div className="hero-scroll">Scroll</div>
      </div>
    </section>
  )
}
