import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSettings, listPlans, listFaqs } from '@/lib/repos'
import { buildMetadata } from '@/lib/seo'
import PlanGrid from '@/components/PlanGrid'
import { Faq } from '@/components/home/Sections'

export const revalidate = 60

export async function generateMetadata() {
  const settings = await getSettings()
  return buildMetadata(settings, {
    title: 'Plans & Pricing',
    description: 'Transparent, fixed-scope plans from HPX Studio — Launch, Growth and Scale. Know what you pay and what you get before we start.',
    path: '/plans',
  })
}

export default async function PlansPage() {
  const settings = await getSettings()
  if (settings.pages?.plans === false) notFound()

  const [plans, faqs] = await Promise.all([listPlans(), listFaqs()])

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="kicker" data-reveal>Plans & pricing</span>
          <h1 data-reveal>Pick a lane, <em>know the cost</em></h1>
          <p className="lead" data-reveal>
            Agencies hide pricing because scope creep is their business model. Mine is the opposite:
            fixed scope, visible price, and you own everything at handover.
          </p>
        </div>
      </section>
      <section className="section-tight">
        <div className="wrap">
          <PlanGrid plans={plans} />
          <p className="form-note" style={{ marginTop: '2rem', textAlign: 'center' }} data-reveal>
            Every plan includes source-code ownership, deployment docs and uptime monitoring.
            Something custom in mind? <Link href="/contact" style={{ color: 'var(--amber)' }}>Let&apos;s scope it together →</Link>
          </p>
        </div>
      </section>
      <Faq faqs={faqs} />
    </>
  )
}
