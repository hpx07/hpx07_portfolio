import { NextResponse } from 'next/server'
import { listPosts, listProjects, getSettings } from '@/lib/repos'

export async function GET(req) {
  const qParam = (new URL(req.url).searchParams.get('q') || '').trim().slice(0, 80)
  if (!qParam) return NextResponse.json({ results: [] })

  const settings = await getSettings()
  const pages = settings.pages || {}
  const results = []
  const needle = qParam.toLowerCase()

  if (pages.projects !== false) {
    const projects = await listProjects({})
    for (const p of projects) {
      if (`${p.title} ${p.category} ${(p.tech || []).join(' ')}`.toLowerCase().includes(needle)) {
        results.push({ label: p.title, href: `/projects/${p.slug}`, group: 'Projects', hint: p.category })
      }
    }
  }
  if (pages.blog !== false) {
    const { posts } = await listPosts({ search: qParam, perPage: 6 })
    for (const post of posts) {
      results.push({ label: post.title, href: `/blog/${post.slug}`, group: 'Articles', hint: post.category })
    }
  }

  return NextResponse.json({ results: results.slice(0, 12) })
}
