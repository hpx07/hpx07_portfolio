import { getSettings, listSocials } from '@/lib/repos'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ScrollFX from '@/components/ScrollFX'
import CommandPalette from '@/components/CommandPalette'
import { JsonLd, orgJsonLd } from '@/lib/seo'

export default async function SiteLayout({ children }) {
  const [settings, socials] = await Promise.all([getSettings(), listSocials()])
  const headerSettings = {
    site_name: settings.site_name,
    logo_url: settings.logo_url,
    logo_text: settings.logo_text,
    availability: settings.availability,
    contact_email: settings.contact_email,
    pages: settings.pages,
  }

  return (
    <>
      <div className="grid-rules" aria-hidden="true" />
      <div className="ambient-bg" aria-hidden="true">
        <span className="ambient-blob-a" />
        <span className="ambient-blob-b" />
        <span className="ambient-blob-c" />
      </div>
      <SiteHeader settings={headerSettings} />
      <main>{children}</main>
      <SiteFooter settings={settings} socials={socials} />
      <ScrollFX />
      <CommandPalette pages={settings.pages} />
      <JsonLd data={orgJsonLd(settings, socials)} />
    </>
  )
}
