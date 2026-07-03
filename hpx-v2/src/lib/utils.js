export function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

export function readingMinutes(markdown) {
  const words = String(markdown || '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function formatDate(value) {
  if (!value) return ''
  const d = value instanceof Date ? value : new Date(String(value).replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function parseJson(value, fallback) {
  if (value == null || value === '') return fallback
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export function truncate(str, len = 160) {
  const s = String(str || '')
  return s.length > len ? `${s.slice(0, len - 1).trimEnd()}…` : s
}

export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}
