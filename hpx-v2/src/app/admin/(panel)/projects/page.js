import ResourceManager from '@/components/admin/ResourceManager'

const fields = [
  { name: 'title', label: 'Title' },
  { name: 'slug', label: 'Slug (blank = auto)', half: true },
  { name: 'category', label: 'Category', half: true },
  { name: 'status', label: 'Status', type: 'select', options: ['published', 'hidden'], half: true, default: 'published' },
  { name: 'featured', label: 'Show on home page', type: 'switch', half: true, default: 1 },
  { name: 'sort_order', label: 'Sort order', type: 'number', half: true, default: 0 },
  { name: 'image', label: 'Cover image', type: 'image', kind: 'project' },
  { name: 'description', label: 'Short description (cards)', type: 'textarea', rows: 3 },
  { name: 'content', label: 'Case study (Markdown)', type: 'markdown' },
  { name: 'tech', label: 'Technologies', type: 'list' },
  { name: 'highlights', label: 'Highlights', type: 'lines', hint: 'one per line' },
  { name: 'live_url', label: 'Live URL', half: true },
  { name: 'repo_url', label: 'Repository URL', half: true },
  { name: 'meta_title', label: 'SEO title', half: true },
  { name: 'meta_description', label: 'SEO description', type: 'textarea', rows: 2 },
]

const columns = [
  { key: 'id', label: '#' },
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status', type: 'badge' },
  { key: 'featured', label: 'Home', type: 'bool' },
  { key: 'sort_order', label: 'Order' },
  { key: 'live_url', label: 'Live URL' },
]

export default function AdminProjectsPage() {
  return (
    <ResourceManager
      resource="projects"
      title="Projects"
      description="Portfolio case studies. Hidden projects disappear from the site but keep their data."
      fields={fields}
      columns={columns}
    />
  )
}
