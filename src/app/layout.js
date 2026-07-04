import './globals.css'
import { getSettings } from '@/lib/repos'
import { buildMetadata } from '@/lib/seo'
import Analytics from '@/components/Analytics'

export async function generateMetadata() {
  const settings = await getSettings()
  return buildMetadata(settings, {})
}

export default async function RootLayout({ children }) {
  const settings = await getSettings()
  const seo = settings.seo || {}
  const defaultTheme = settings.default_theme === 'light' ? 'light' : 'dark'

  return (
    <html lang="en" data-theme={defaultTheme} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* apply the visitor's stored theme before first paint — no flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('hpx_theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Archivo:wght@300..800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
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
      <body>
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
