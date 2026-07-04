import Link from 'next/link'
import { notFound } from 'next/navigation'
import { marked } from 'marked'
import { getSettings, getPostBySlug, listPosts, incrementViews } from '@/lib/repos'
import { buildMetadata, JsonLd, articleJsonLd, breadcrumbJsonLd } from '@/lib/seo'
import { formatDate, readingMinutes } from '@/lib/utils'
import ReadingProgress from '@/components/ReadingProgress'
import PostCard from '@/components/PostCard'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = await params
  const [settings, post] = await Promise.all([getSettings(), getPostBySlug(slug)])
  if (!post) return {}
  return buildMetadata(settings, {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    path: `/blog/${post.slug}`,
    ogImage: post.og_image || post.cover_image,
    keywords: post.meta_keywords || (post.tags || []).join(', '),
    type: 'article',
  })
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const [settings, post] = await Promise.all([getSettings(), getPostBySlug(slug)])
  if (settings.pages?.blog === false || !post) notFound()

  incrementViews('posts', post.id)

  const html = marked.parse(post.content || '')
  const related = (await listPosts({ perPage: 3 })).posts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <>
      <ReadingProgress />
      <article>
        <header className="article-hero">
          <div className="wrap">
            <div className="post-meta" data-reveal>
              {post.category && <span className="cat">{post.category}</span>}
              <span>{formatDate(post.published_at || post.created_at)}</span>
              <span>{readingMinutes(post.content)} min read</span>
              {Number(post.views) > 0 && <span>{post.views} views</span>}
            </div>
            <h1 data-reveal>{post.title}</h1>
            {post.excerpt && <p className="lead" data-reveal style={{ color: 'var(--muted)', maxWidth: '58ch', marginTop: '1.2rem' }}>{post.excerpt}</p>}
          </div>
        </header>
        <div className="wrap">
          {post.cover_image && (
            <div className="article-cover" data-reveal="scale">
              <img src={post.cover_image} alt={post.title} />
            </div>
          )}
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
          {(post.tags || []).length > 0 && (
            <div className="tag-row" style={{ margin: '2.5rem 0' }}>
              {post.tags.map((t) => (
                <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className="tag">#{t}</Link>
              ))}
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="section-tight">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="kicker">Keep reading</span>
                <h2>More from the <em>workbench</em></h2>
              </div>
              <Link href="/blog" className="section-link">All articles →</Link>
            </div>
            <div className="post-grid">
              {related.map((p, i) => (
                <PostCard key={p.slug} post={p} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd data={articleJsonLd(post, settings)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
    </>
  )
}
