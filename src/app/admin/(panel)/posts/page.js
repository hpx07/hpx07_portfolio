import ResourceManager from '@/components/admin/ResourceManager'

const fields = [
  { name: 'title', label: 'Title' },
  { name: 'slug', label: 'Slug (blank = auto from title)', half: true },
  { name: 'category', label: 'Category', half: true, default: 'Engineering Tips' },
  { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], half: true, default: 'draft' },
  { name: 'featured', label: 'Featured on home page', type: 'switch', half: true, default: 0 },
  { name: 'cover_image', label: 'Cover image', type: 'image', kind: 'blog' },
  { name: 'excerpt', label: 'Excerpt (used in cards + meta description fallback)', type: 'textarea', rows: 3 },
  { name: 'content', label: 'Content (Markdown)', type: 'markdown' },
  { name: 'tags', label: 'Tags', type: 'list', half: true, hint: 'comma separated — used for filtering & SEO keywords' },
  { name: 'published_at', label: 'Publish date (YYYY-MM-DD HH:MM:SS, blank = auto)', half: true },
  { name: 'meta_title', label: 'SEO title (blank = post title)', half: true },
  { name: 'meta_keywords', label: 'SEO keywords', half: true },
  { name: 'meta_description', label: 'SEO description (blank = excerpt)', type: 'textarea', rows: 2 },
  { name: 'og_image', label: 'Social share image (blank = cover)', type: 'image', kind: 'og' },
]

const columns = [
  { key: 'id', label: '#' },
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status', type: 'badge' },
  { key: 'featured', label: 'Featured', type: 'bool' },
  { key: 'views', label: 'Views' },
  { key: 'published_at', label: 'Published', type: 'date' },
]

export default function AdminPostsPage() {
  return (
    <ResourceManager
      resource="posts"
      title="Blog posts"
      description="Tips and articles. Each post carries its own SEO fields, JSON-LD and view counter."
      fields={fields}
      columns={columns}
    />
  )
}
