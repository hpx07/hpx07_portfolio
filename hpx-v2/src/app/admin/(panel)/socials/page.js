import ResourceManager from '@/components/admin/ResourceManager'

const fields = [
  { name: 'label', label: 'Label', half: true },
  { name: 'icon', label: 'Icon name (github / mail / map-pin / linkedin…)', half: true },
  { name: 'url', label: 'URL (https://… or mailto:…)' },
  { name: 'sort_order', label: 'Sort order', type: 'number', half: true, default: 0 },
  { name: 'active', label: 'Active', type: 'switch', half: true, default: 1 },
]

const columns = [
  { key: 'id', label: '#' },
  { key: 'label', label: 'Label' },
  { key: 'url', label: 'URL' },
  { key: 'sort_order', label: 'Order' },
  { key: 'active', label: 'Active', type: 'bool' },
]

export default function AdminSocialsPage() {
  return (
    <ResourceManager
      resource="socials"
      title="Social links"
      description="Shown in the footer and the contact section."
      fields={fields}
      columns={columns}
    />
  )
}
