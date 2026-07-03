import ResourceManager from '@/components/admin/ResourceManager'

const fields = [
  { name: 'question', label: 'Question' },
  { name: 'answer', label: 'Answer', type: 'textarea', rows: 4 },
  { name: 'sort_order', label: 'Sort order', type: 'number', half: true, default: 0 },
  { name: 'active', label: 'Active', type: 'switch', half: true, default: 1 },
]

const columns = [
  { key: 'id', label: '#' },
  { key: 'question', label: 'Question' },
  { key: 'sort_order', label: 'Order' },
  { key: 'active', label: 'Active', type: 'bool' },
]

export default function AdminFaqsPage() {
  return (
    <ResourceManager
      resource="faqs"
      title="FAQs"
      description="Shown on the home page and the plans page."
      fields={fields}
      columns={columns}
    />
  )
}
