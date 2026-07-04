// Proxies Google PageSpeed Insights so the admin dashboard can show
// performance / SEO / accessibility / best-practice scores per project.
import { NextResponse } from 'next/server'

export const maxDuration = 120

export async function GET(req) {
  const url = new URL(req.url).searchParams.get('url')
  if (!url || !/^https?:\/\//.test(url)) {
    return NextResponse.json({ error: 'A valid ?url= is required' }, { status: 400 })
  }
  try {
    const api = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
    api.searchParams.set('url', url)
    api.searchParams.set('strategy', 'mobile')
    for (const cat of ['performance', 'seo', 'accessibility', 'best-practices']) {
      api.searchParams.append('category', cat)
    }
    if (process.env.PSI_API_KEY) api.searchParams.set('key', process.env.PSI_API_KEY)

    const res = await fetch(api, { cache: 'no-store' })
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: `PSI ${res.status}: ${text.slice(0, 300)}` }, { status: 502 })
    }
    const data = await res.json()
    const cats = data.lighthouseResult?.categories || {}
    const audits = data.lighthouseResult?.audits || {}
    const pct = (c) => (c?.score != null ? Math.round(c.score * 100) : null)
    return NextResponse.json({
      ok: true,
      url,
      scores: {
        performance: pct(cats.performance),
        seo: pct(cats.seo),
        accessibility: pct(cats.accessibility),
        bestPractices: pct(cats['best-practices']),
      },
      metrics: {
        fcp: audits['first-contentful-paint']?.displayValue || null,
        lcp: audits['largest-contentful-paint']?.displayValue || null,
        cls: audits['cumulative-layout-shift']?.displayValue || null,
        tbt: audits['total-blocking-time']?.displayValue || null,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
