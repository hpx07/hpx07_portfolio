'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

// Ctrl/⌘+K command palette — navigates the site and live-searches
// posts + projects through /api/search.
export default function CommandPalette({ pages = {} }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [sel, setSel] = useState(0)
  const inputRef = useRef(null)
  const debounceRef = useRef(0)
  const router = useRouter()

  const staticItems = [
    { label: 'Home', href: '/', group: 'Pages' },
    pages.projects !== false && { label: 'Projects', href: '/projects', group: 'Pages' },
    pages.blog !== false && { label: 'Blog & Tips', href: '/blog', group: 'Pages' },
    pages.plans !== false && { label: 'Plans & Pricing', href: '/plans', group: 'Pages' },
    pages.contact !== false && { label: 'Contact', href: '/contact', group: 'Pages' },
  ].filter(Boolean)

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setResults([])
    setSel(0)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') close()
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('hpx:cmdk', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('hpx:cmdk', onOpen)
    }
  }, [close])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30)
  }, [open])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (!query.trim()) {
      setResults([])
      return
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results || [])
      } catch {
        setResults([])
      }
    }, 180)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  const filteredStatic = query
    ? staticItems.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
    : staticItems
  const items = [...filteredStatic, ...results]

  const go = (item) => {
    close()
    router.push(item.href)
  }

  const onInputKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, items.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && items[sel]) go(items[sel])
  }

  if (!open) return null

  let lastGroup = ''
  return (
    <div className="cmdk-overlay" onClick={close} role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSel(0) }}
          onKeyDown={onInputKey}
          placeholder="Search pages, projects, articles…"
          aria-label="Search"
        />
        <div className="cmdk-list">
          {items.length === 0 && <div className="cmdk-empty">Nothing found for “{query}”</div>}
          {items.map((item, i) => {
            const showGroup = item.group !== lastGroup
            lastGroup = item.group
            return (
              <div key={`${item.href}-${i}`}>
                {showGroup && <div className="cmdk-group">{item.group}</div>}
                <div
                  className={`cmdk-item ${i === sel ? 'sel' : ''}`}
                  onMouseEnter={() => setSel(i)}
                  onClick={() => go(item)}
                >
                  <span>{item.label}</span>
                  <span className="hint">{item.hint || 'Go'} ↵</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
