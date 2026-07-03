import { getSettings, listPosts, listProjects } from '@/lib/repos'
import { siteUrl } from '@/lib/seo'

export default async function sitemap() {
  const base = siteUrl()
  const settings = await getSettings()
  const pages = settings.pages || {}

  const entries = [{ url: base, changeFrequency: 'weekly', priority: 1 }]
  if (pages.projects !== false) entries.push({ url: `${base}/projects`, changeFrequency: 'weekly', priority: 0.9 })
  if (pages.blog !== false) entries.push({ url: `${base}/blog`, changeFrequency: 'daily', priority: 0.9 })
  if (pages.plans !== false) entries.push({ url: `${base}/plans`, changeFrequency: 'monthly', priority: 0.8 })
  if (pages.contact !== false) entries.push({ url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.7 })

  try {
    if (pages.projects !== false) {
      const projects = await listProjects({})
      for (const p of projects) {
        entries.push({ url: `${base}/projects/${p.slug}`, changeFrequency: 'monthly', priority: 0.7 })
      }
    }
    if (pages.blog !== false) {
      const { posts } = await listPosts({ perPage: 5000 })
      for (const post of posts) {
        entries.push({
          url: `${base}/blog/${post.slug}`,
          lastModified: post.published_at || undefined,
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    }
  } catch {
    /* sitemap still returns static pages if DB is down */
  }
  return entries
}
