import Link from 'next/link'

export default function ProjectCard({ project, delay = 0 }) {
  const hasLive = project.live_url && project.live_url !== '#'
  return (
    <article className="proj-card" data-reveal style={{ '--reveal-delay': `${delay}s` }}>
      <Link href={`/projects/${project.slug}`} className="proj-media" aria-label={project.title}>
        {project.image && <img src={project.image} alt={project.title} loading="lazy" />}
        <span className="proj-cat">{project.category}</span>
      </Link>
      <div className="proj-body">
        <h3>
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        <p>{project.description}</p>
        <div className="proj-tech">
          {(project.tech || []).slice(0, 6).map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="proj-links">
          <Link href={`/projects/${project.slug}`}>Case study →</Link>
          {hasLive ? (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer">Live ↗</a>
          ) : (
            <span className="disabled">Private build</span>
          )}
        </div>
      </div>
    </article>
  )
}
