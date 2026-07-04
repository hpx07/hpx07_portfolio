import ResourceManager from '@/components/admin/ResourceManager'

const fields = [
  { name: 'name', label: 'Name', half: true },
  { name: 'category', label: 'Category (Languages / Frameworks / Tools / AI Workflow…)', half: true },
  { name: 'level', label: 'Proficiency (0–100)', type: 'number', half: true, default: 80 },
  { name: 'sort_order', label: 'Sort order', type: 'number', half: true, default: 0 },
  { name: 'active', label: 'Active', type: 'switch', half: true, default: 1 },
]

const columns = [
  { key: 'id', label: '#' },
  { key: 'name', label: 'Skill' },
  { key: 'category', label: 'Category' },
  { key: 'level', label: 'Level' },
  { key: 'active', label: 'Active', type: 'bool' },
]

export default function AdminSkillsPage() {
  return (
    <ResourceManager
      resource="skills"
      title="Skills"
      description="Tools & technologies — grouped by category on the home page ledger and the marquee."
      fields={fields}
      columns={columns}
    />
  )
}
