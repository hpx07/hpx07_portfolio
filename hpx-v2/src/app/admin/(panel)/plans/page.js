import ResourceManager from '@/components/admin/ResourceManager'

const fields = [
  { name: 'name', label: 'Plan name', half: true },
  { name: 'badge', label: 'Badge (e.g. Most popular)', half: true },
  { name: 'tagline', label: 'Tagline' },
  { name: 'currency', label: 'Currency symbol', half: true },
  { name: 'price', label: 'Price (text — "499" or "Custom")', half: true },
  { name: 'period', label: 'Period (one-time / per project / retainer)', half: true },
  { name: 'highlighted', label: 'Highlight this plan', type: 'switch', half: true, default: 0 },
  { name: 'features', label: 'Features', type: 'lines', hint: 'one per line' },
  { name: 'cta_label', label: 'Button label', half: true },
  { name: 'cta_link', label: 'Button link', half: true, hint: 'e.g. /contact?plan=growth' },
  { name: 'sort_order', label: 'Sort order', type: 'number', half: true, default: 0 },
  { name: 'active', label: 'Active', type: 'switch', half: true, default: 1 },
]

const columns = [
  { key: 'id', label: '#' },
  { key: 'name', label: 'Plan' },
  { key: 'price', label: 'Price' },
  { key: 'period', label: 'Period' },
  { key: 'highlighted', label: 'Highlighted', type: 'bool' },
  { key: 'active', label: 'Active', type: 'bool' },
  { key: 'sort_order', label: 'Order' },
]

export default function AdminPlansPage() {
  return (
    <ResourceManager
      resource="plans"
      title="Plans"
      description="Agency pricing tiers shown on /plans and the home page."
      fields={fields}
      columns={columns}
    />
  )
}
