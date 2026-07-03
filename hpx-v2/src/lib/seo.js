// SEO helpers — central place where page metadata and JSON-LD are built.

export function siteUrl() {
  return (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
}

export function buildMetadata(settings, { title, description, path = '/', ogImage, keywords, type = 'website' } = {}) {
  const seo = settings.seo || {}
  const finalTitle = title ? `${title} — ${settings.site_name}` : seo.meta_title || settings.site_name
  const finalDesc = description || seo.meta_description || settings.tagline
  const url = `${siteUrl()}${path}`
  const image = ogImage || seo.og_image || undefined

  const meta = {
    title: finalTitle,
    description: finalDesc,
    keywords: keywords || seo.keywords || undefined,
    metadataBase: new URL(siteUrl()),
    alternates: { canonical: url },
    openGraph: {
      title: finalTitle,
      description: finalDesc,
      url,
      siteName: settings.site_name,
      type: type === 'article' ? 'article' : 'website',
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: finalTitle,
      description: finalDesc,
      ...(seo.twitter_handle ? { creator: seo.twitter_handle } : {}),
      ...(image ? { images: [image] } : {}),
    },
    robots: { index: true, follow: true },
  }
  if (seo.verification_google) {
    meta.verification = { google: seo.verification_google }
  }
  if (settings.favicon_url) {
    meta.icons = { icon: settings.favicon_url }
  }
  return meta
}

export function orgJsonLd(settings, socials = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: settings.site_name,
    founder: { '@type': 'Person', name: settings.site_owner },
    description: settings.seo?.meta_description,
    url: siteUrl(),
    email: settings.contact_email,
    address: { '@type': 'PostalAddress', addressRegion: settings.location_label },
    sameAs: socials.filter((s) => s.url?.startsWith('http')).map((s) => s.url),
  }
}

export function articleJsonLd(post, settings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt,
    image: post.og_image || post.cover_image || undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    author: { '@type': 'Person', name: settings.site_owner, url: siteUrl() },
    publisher: { '@type': 'Organization', name: settings.site_name },
    mainEntityOfPage: `${siteUrl()}/blog/${post.slug}`,
    keywords: Array.isArray(post.tags) ? post.tags.join(', ') : post.meta_keywords,
  }
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteUrl()}${item.path}`,
    })),
  }
}

export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
