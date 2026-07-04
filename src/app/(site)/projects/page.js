import { notFound } from 'next/navigation'
import { getSettings, listProjects } from '@/lib/repos'
import { buildMetadata } from '@/lib/seo'
import ProjectCard from '@/components/ProjectCard'

export const revalidate = 60

export async function generateMetadata() {
  const settings = await getSettings()
  return buildMetadata(settings, {
    title: 'Projects',
    description: 'Selected builds across web apps, mobile apps, games and ERP systems — engineered by HPX Studio.',
    path: '/projects',
  })
}

export default async function ProjectsPage() {
  const settings = await getSettings()
  if (settings.pages?.projects === false) notFound()

  const projects = await listProjects({})

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="kicker" data-reveal>Portfolio</span>
          <h1 data-reveal>Work that <em>ships and survives</em></h1>
          <p className="lead" data-reveal>
            Web apps, Android builds, real-time systems and a production ERP — every project below
            solved a real problem for real users.
          </p>
        </div>
      </section>
      <section className="section-tight">
        <div className="wrap">
          <div className="proj-grid">
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} delay={(i % 2) * 0.08} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
