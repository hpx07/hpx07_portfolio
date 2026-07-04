import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = {
  title: 'HPX Admin',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">{children}</div>
    </div>
  )
}
