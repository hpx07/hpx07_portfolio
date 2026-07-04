import Link from 'next/link'
import { notFound } from 'next/navigation'
import { marked } from 'marked'
import { getSettings, getProjectBySlug, listProjects } from '@/lib/repos'
import { buildMetadata, JsonLd, breadcrumbJsonLd } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = await params
  const [settings, project] = await Promise.all([getSettings(), getProjectBySlug(slug)])
  if (!project) return {}
  return buildMetadata(settings, {
    title: project.meta_title || project.title,
    description: project.meta_description || project.description,
    path: `/projects/${project.slug}`,
    ogImage: project.image,
  })
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params
  const [settings, project] = await Promise.all([getSettings(), getProjectBySlug(slug)])
  if (settings.pages?.projects === false || !project) notFound()

  const hasLive = project.live_url && project.live_url !== '#'
  const html = project.content ? marked.parse(project.content) : ''

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="kicker" data-reveal>{project.category}</span>
          <h1 data-reveal>{project.title}</h1>
          <p className="lead" data-reveal>{project.description}</p>
          <div className="hero-actions" data-reveal>
            {hasLive && (
              <a className="btn btn-ember" href={project.live_url} target="_blank" rel="noopener noreferrer">
                Visit live ↗
              </a>
            )}
            {project.repo_url && (
              <a className="btn btn-ghost" href={project.repo_url} target="_blank" rel="noopener noreferrer">
                Source code
              </a>
            )}
            <Link className="btn btn-ghost" href="/projects">← All projects</Link>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          {project.image && (
            <div className="article-cover" data-reveal="scale">
              <img src={project.image} alt={project.title} />
            </div>
          )}

          <div className="tech-cats" style={{ marginBottom: '2.5rem' }}>
            <div className="tech-cat" data-reveal>
              <h3>Technologies</h3>
              <div className="proj-tech" style={{ paddingTop: 0 }}>
                {(project.tech || []).map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
            <div className="tech-cat" data-reveal>
              <h3>Highlights</h3>
              <ul className="plan-features">
                {(project.highlights || []).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </div>

          {html && (
            <div className="prose" data-reveal dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Projects', path: '/projects' },
          { name: project.title, path: `/projects/${project.slug}` },
        ])}
      />
    </>
  )
}

export async function generateStaticParams() {
  try {
    const projects = await listProjects({})
    return projects.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}
