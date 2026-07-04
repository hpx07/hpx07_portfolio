import ResourceManager from '@/components/admin/ResourceManager'

const fields = [
  { name: 'author', label: 'Author', half: true },
  { name: 'role', label: 'Role', half: true },
  { name: 'company', label: 'Company', half: true },
  { name: 'rating', label: 'Rating (1–5)', type: 'number', half: true, default: 5 },
  { name: 'quote', label: 'Quote', type: 'textarea', rows: 4 },
  { name: 'avatar', label: 'Avatar image', type: 'image', kind: 'avatar' },
  { name: 'sort_order', label: 'Sort order', type: 'number', half: true, default: 0 },
  { name: 'active', label: 'Active', type: 'switch', half: true, default: 1 },
]

const columns = [
  { key: 'id', label: '#' },
  { key: 'author', label: 'Author' },
  { key: 'company', label: 'Company' },
  { key: 'rating', label: '★' },
  { key: 'quote', label: 'Quote' },
  { key: 'active', label: 'Active', type: 'bool' },
]

export default function AdminTestimonialsPage() {
  return (
    <ResourceManager
      resource="testimonials"
      title="Testimonials"
      description="Social proof shown in the Trust section."
      fields={fields}
      columns={columns}
    />
  )
}
