import { getSettings, listPosts } from '@/lib/repos'
import { siteUrl } from '@/lib/seo'

export const revalidate = 300

const esc = (s) =>
  String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function GET() {
  const [settings, { posts }] = await Promise.all([getSettings(), listPosts({ perPage: 30 })])
  const base = siteUrl()

  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${base}/blog/${p.slug}</link>
      <guid>${base}/blog/${p.slug}</guid>
      <description>${esc(p.excerpt)}</description>
      ${p.published_at ? `<pubDate>${new Date(String(p.published_at).replace(' ', 'T')).toUTCString()}</pubDate>` : ''}
    </item>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(settings.site_name)} — Blog</title>
    <link>${base}/blog</link>
    <description>${esc(settings.seo?.meta_description)}</description>
    <language>en</language>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
