'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '◈', exact: true },
  { sep: 'Content' },
  { href: '/admin/posts', label: 'Blog posts', icon: '✎' },
  { href: '/admin/projects', label: 'Projects', icon: '▣' },
  { href: '/admin/plans', label: 'Plans', icon: '❖' },
  { href: '/admin/skills', label: 'Skills', icon: '⚒' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: '❝' },
  { href: '/admin/faqs', label: 'FAQs', icon: '?' },
  { sep: 'Growth' },
  { href: '/admin/monitor', label: 'Project health', icon: '♥' },
  { href: '/admin/analytics', label: 'Analytics & tags', icon: '∿' },
  { href: '/admin/messages', label: 'Inbox', icon: '✉' },
  { sep: 'Site' },
  { href: '/admin/socials', label: 'Social links', icon: '↗' },
  { href: '/admin/settings', label: 'Settings & SEO', icon: '⚙' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside className="admin-side">
      <Link href="/" className="brand" target="_blank">
        <span>HPX Admin</span>
      </Link>
      {NAV.map((item, i) =>
        item.sep ? (
          <div key={`sep-${i}`} className="side-sep">{item.sep}</div>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            className={`side-link ${(item.exact ? pathname === item.href : pathname.startsWith(item.href)) ? 'active' : ''}`}
          >
            <span aria-hidden="true">{item.icon}</span>
            <em style={{ fontStyle: 'normal' }}>{item.label}</em>
          </Link>
        ),
      )}
      <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <ThemeToggle />
        <button type="button" className="a-btn ghost sm" onClick={logout} style={{ flex: 1, justifyContent: 'center' }}>
          Sign out
        </button>
      </div>
    </aside>
  )
}
