import './globals.css'
import { Fraunces, Archivo, JetBrains_Mono, Orbitron } from 'next/font/google'
import { getSettings } from '@/lib/repos'
import { buildMetadata } from '@/lib/seo'
import Analytics from '@/components/Analytics'

// Self-hosted at build time (no external request, no render-blocking
// preconnect round trip) — critical on slow/metered connections.
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-fraunces',
})
const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-jbmono',
})
// Geometric tech wordmark for the HPX.DEV logo (BROLINK-style).
const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-logo',
})

export async function generateMetadata() {
  const settings = await getSettings()
  return buildMetadata(settings, {})
}

export default async function RootLayout({ children }) {
  const settings = await getSettings()
  const seo = settings.seo || {}
  const defaultTheme = ['light', 'pine'].includes(settings.default_theme)
    ? settings.default_theme
    : 'dark'

  return (
    <html
      lang="en"
      data-theme={defaultTheme}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${fraunces.variable} ${archivo.variable} ${jetbrainsMono.variable} ${orbitron.variable}`}
    >
      <head>
        {/* apply the visitor's theme + reduce fx for low-end/reduced-motion devices before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{
var d=document.documentElement,t=localStorage.getItem('hpx_theme');
if(t==='light'||t==='dark'||t==='pine')d.dataset.theme=t;
var nav=navigator,c=nav.hardwareConcurrency||4,mem=nav.deviceMemory||8;
var sd=nav.connection&&(nav.connection.saveData||/2g/.test(nav.connection.effectiveType||''));
var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(rm||sd||c<=2||mem<=2)d.dataset.fx='lite';
}catch(e){}`,
          }}
        />
        {seo.gtm_id && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${seo.gtm_id}');`,
            }}
          />
        )}
        {seo.ga_id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${seo.ga_id}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${seo.ga_id}');`,
              }}
            />
          </>
        )}
      </head>
      {/* suppressHydrationWarning: browser extensions (ColorZilla etc.) inject
          attributes into <body> before React hydrates — harmless, silence it */}
      <body suppressHydrationWarning>
        {seo.gtm_id && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${seo.gtm_id}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {seo.custom_head && (
          <div style={{ display: 'none' }} dangerouslySetInnerHTML={{ __html: seo.custom_head }} />
        )}
        {children}
        <Analytics />
      </body>
    </html>
  )
}
