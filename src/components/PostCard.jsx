import Link from 'next/link'
import { formatDate, readingMinutes } from '@/lib/utils'

export default function PostCard({ post, delay = 0 }) {
  return (
    <article className="post-card" data-reveal style={{ '--reveal-delay': `${delay}s` }}>
      <Link href={`/blog/${post.slug}`} className="post-media" aria-label={post.title}>
        {post.cover_image && <img src={post.cover_image} alt={post.title} loading="lazy" />}
      </Link>
      <div className="post-body">
        <div className="post-meta">
          {post.category && <span className="cat">{post.category}</span>}
          <span>{formatDate(post.published_at || post.created_at)}</span>
        </div>
        <h3>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className="post-read">
          Read {post.content ? `· ${readingMinutes(post.content)} min` : ''} →
        </Link>
      </div>
    </article>
  )
}
