import { notFound } from 'next/navigation'
import { getSettings, listSocials } from '@/lib/repos'
import { buildMetadata } from '@/lib/seo'
import { ContactSection } from '@/components/home/Sections'

export const revalidate = 60

export async function generateMetadata() {
  const settings = await getSettings()
  return buildMetadata(settings, {
    title: 'Contact',
    description: `Start a project with ${settings.site_owner} — replies within 24 hours, remote worldwide.`,
    path: '/contact',
  })
}

export default async function ContactPage({ searchParams }) {
  const settings = await getSettings()
  if (settings.pages?.contact === false) notFound()

  const sp = await searchParams
  const presetPlan = typeof sp?.plan === 'string' ? sp.plan : ''
  const socials = await listSocials()

  return (
    <>
      <section className="page-hero" style={{ paddingBottom: '1rem' }}>
        <div className="wrap">
          <span className="kicker" data-reveal>Contact</span>
          <h1 data-reveal>Tell me what needs <em>building</em></h1>
          <p className="lead" data-reveal>
            One honest reply within 24 hours — either a plan to build it, or a straight
            &quot;I&apos;m not the right person&quot; with a pointer to who is.
          </p>
        </div>
      </section>
      <ContactSection settings={settings} socials={socials} presetPlan={presetPlan} />
    </>
  )
}
