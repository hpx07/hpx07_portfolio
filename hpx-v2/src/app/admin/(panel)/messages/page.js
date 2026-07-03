import ResourceManager from '@/components/admin/ResourceManager'

const columns = [
  { key: 'id', label: '#' },
  { key: 'name', label: 'From' },
  { key: 'email', label: 'Email' },
  { key: 'subject', label: 'Subject' },
  { key: 'plan', label: 'Plan' },
  { key: 'body', label: 'Message' },
  { key: 'is_read', label: 'Read', type: 'bool' },
  { key: 'created_at', label: 'Date', type: 'date' },
]

export default function AdminMessagesPage() {
  return (
    <ResourceManager
      resource="messages"
      title="Inbox"
      description="Messages from the contact form. Hover a truncated message to read it in full."
      fields={[]}
      columns={columns}
      readOnly
      toggleField="is_read"
    />
  )
}
