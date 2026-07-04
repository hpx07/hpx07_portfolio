import {
  getSettings,
  listProjects,
  listSkills,
  listPlans,
  listTestimonials,
  listPosts,
  listFaqs,
  listSocials,
} from '@/lib/repos'
import Hero from '@/components/home/Hero'
import {
  Statement,
  Marquee,
  WorkedWith,
  Stats,
  ProjectsPreview,
  TechStack,
  Process,
  PlansPreview,
  Testimonials,
  BlogPreview,
  Faq,
  ContactSection,
} from '@/components/home/Sections'

export const revalidate = 60

export default async function HomePage() {
  const settings = await getSettings()
  const on = settings.sections || {}

  const [projects, skills, plans, testimonials, postsData, faqs, socials] = await Promise.all([
    on.projects !== false ? listProjects({ featuredOnly: true, limit: 4 }) : [],
    on.tech !== false || on.worked_with !== false ? listSkills() : [],
    on.plans !== false ? listPlans() : [],
    on.testimonials !== false ? listTestimonials() : [],
    on.blog !== false ? listPosts({ perPage: 3 }) : { posts: [] },
    on.faq !== false ? listFaqs() : [],
    listSocials(),
  ])

  return (
    <>
      {on.hero !== false && <Hero settings={settings} />}
      {on.tech !== false && skills.length > 0 && <Marquee skills={skills} />}
      {on.statement !== false && <Statement settings={settings} />}
      {on.worked_with !== false && skills.length > 0 && <WorkedWith skills={skills} />}
      {on.stats !== false && <Stats stats={settings.stats || []} />}
      {on.projects !== false && projects.length > 0 && <ProjectsPreview projects={projects} />}
      {on.tech !== false && skills.length > 0 && <TechStack skills={skills} />}
      {on.process !== false && <Process steps={settings.process || []} />}
      {on.plans !== false && plans.length > 0 && <PlansPreview plans={plans} />}
      {on.testimonials !== false && <Testimonials testimonials={testimonials} />}
      {on.blog !== false && postsData.posts.length > 0 && <BlogPreview posts={postsData.posts} />}
      {on.faq !== false && <Faq faqs={faqs} />}
      {on.contact !== false && <ContactSection settings={settings} socials={socials} />}
    </>
  )
}
