import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSettings, listPosts } from '@/lib/repos'
import { buildMetadata } from '@/lib/seo'
import PostCard from '@/components/PostCard'

export const revalidate = 60

export async function generateMetadata() {
  const settings = await getSettings()
  return buildMetadata(settings, {
    title: 'Blog & Tips',
    description: 'Engineering tips, design notes and performance deep-dives from the HPX Studio workbench.',
    path: '/blog',
  })
}

export default async function BlogPage({ searchParams }) {
  const settings = await getSettings()
  if (settings.pages?.blog === false) notFound()

  const sp = await searchParams
  const page = Math.max(1, Number(sp?.page) || 1)
  const search = typeof sp?.q === 'string' ? sp.q.slice(0, 80) : ''
  const tag = typeof sp?.tag === 'string' ? sp.tag.slice(0, 40) : ''

  const { posts, pages } = await listPosts({ page, perPage: 9, search, tag })

  const qs = (p) => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (tag) params.set('tag', tag)
    if (p > 1) params.set('page', String(p))
    const str = params.toString()
    return str ? `/blog?${str}` : '/blog'
  }

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="kicker" data-reveal>Tips & writing</span>
          <h1 data-reveal>Notes from the <em>workbench</em></h1>
          <p className="lead" data-reveal>
            Practical engineering tips, design theory and performance breakdowns — written for
            developers and founders who like their advice tested in production.
          </p>
          <form action="/blog" method="get" style={{ maxWidth: 420, marginTop: '1.8rem' }} data-reveal>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="blog-q">Search articles</label>
              <input id="blog-q" type="search" name="q" defaultValue={search} placeholder="performance, color, offline…" />
            </div>
          </form>
          {tag && (
            <p className="form-note" style={{ marginTop: '1rem' }}>
              Filtering by tag <strong>#{tag}</strong> — <Link href="/blog" style={{ color: 'var(--amber)' }}>clear</Link>
            </p>
          )}
        </div>
      </section>
      <section className="section-tight">
        <div className="wrap">
          {posts.length === 0 ? (
            <p className="lead">No articles found{search ? ` for “${search}”` : ''}.</p>
          ) : (
            <div className="post-grid">
              {posts.map((p, i) => (
                <PostCard key={p.slug} post={p} delay={(i % 3) * 0.08} />
              ))}
            </div>
          )}
          {pages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              {page > 1 && <Link href={qs(page - 1)}>←</Link>}
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) =>
                p === page ? (
                  <span key={p} className="current">{p}</span>
                ) : (
                  <Link key={p} href={qs(p)}>{p}</Link>
                ),
              )}
              {page < pages && <Link href={qs(page + 1)}>→</Link>}
            </nav>
          )}
        </div>
      </section>
    </>
  )
}
