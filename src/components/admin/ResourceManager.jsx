'use client'

// Generic CRUD screen. Configured entirely by props from each admin page:
//   resource  — API resource name (/api/admin/<resource>)
//   fields    — form schema: { name, label, type, options?, rows?, half? }
//               types: text | textarea | markdown | number | switch | select | list | image | datetime
//   columns   — table columns: { key, label, type? (badge|bool|date|views) }
//   readOnly  — hides New/Edit (inbox view); toggleField still works
import { useCallback, useEffect, useRef, useState } from 'react'

export function ImageField({ value, onChange, kind }) {
  const [busy, setBusy] = useState(false)
  const fileRef = useRef(null)

  const upload = async (file) => {
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('kind', kind || 'media')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (json.url) onChange(json.url)
      else alert(json.error || 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="upload-tile">
      {value ? <img src={value} alt="" /> : <span className="a-badge">none</span>}
      <div style={{ flex: 1, display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          style={{ flex: 1, minWidth: 160 }}
          className="a-input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or /uploads/…"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
        <button type="button" className="a-btn ghost sm" disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? 'Uploading…' : 'Upload'}
        </button>
      </div>
    </div>
  )
}

function FieldInput({ field, value, onChange }) {
  const common = { id: `f-${field.name}` }
  switch (field.type) {
    case 'textarea':
    case 'markdown':
      return (
        <textarea
          {...common}
          rows={field.rows || (field.type === 'markdown' ? 12 : 4)}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          style={field.type === 'markdown' ? { fontFamily: 'var(--font-mono)', fontSize: '0.84rem' } : undefined}
        />
      )
    case 'number':
      return <input {...common} type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
    case 'switch':
      return (
        <label className="switch">
          <input type="checkbox" checked={Number(value) === 1} onChange={(e) => onChange(e.target.checked ? 1 : 0)} />
          <i />
        </label>
      )
    case 'select':
      return (
        <select {...common} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {(field.options || []).map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      )
    case 'list':
      return (
        <input
          {...common}
          value={Array.isArray(value) ? value.join(', ') : value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="comma, separated, values"
        />
      )
    case 'lines':
      return (
        <textarea
          {...common}
          rows={field.rows || 6}
          value={Array.isArray(value) ? value.join('\n') : value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={'one item per line'}
        />
      )
    case 'image':
      return <ImageField value={value} onChange={onChange} kind={field.kind} />
    default:
      return <input {...common} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
  }
}

function toApiValue(field, value) {
  if (field.type === 'list' || field.type === 'lines') {
    if (Array.isArray(value)) return value
    return String(value || '')
      .split(field.type === 'lines' ? '\n' : ',')
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return value
}

function fromRowValue(field, value) {
  if ((field.type === 'list' || field.type === 'lines') && typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : value
    } catch {
      return value
    }
  }
  return value
}

function CellValue({ col, row }) {
  const value = row[col.key]
  if (col.type === 'bool') {
    return <span className={`a-badge ${Number(value) ? 'ok' : ''}`}>{Number(value) ? 'yes' : 'no'}</span>
  }
  if (col.type === 'badge') {
    const cls = value === 'published' ? 'ok' : value === 'draft' ? 'warn' : 'hot'
    return <span className={`a-badge ${cls}`}>{String(value || '—')}</span>
  }
  if (col.type === 'date') return <span style={{ whiteSpace: 'nowrap', color: 'var(--muted)' }}>{String(value || '').slice(0, 10) || '—'}</span>
  const str = String(value ?? '')
  return <span title={str}>{str.length > 60 ? `${str.slice(0, 60)}…` : str || '—'}</span>
}

export default function ResourceManager({ resource, title, description, fields, columns, readOnly = false, toggleField = '' }) {
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // null | {} (new) | row
  const [form, setForm] = useState({})
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const perPage = 25

  const load = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), perPage: String(perPage) })
    if (search) params.set('q', search)
    const res = await fetch(`/api/admin/${resource}?${params}`)
    const json = await res.json()
    if (res.ok) {
      setRows(json.rows || [])
      setTotal(json.total || 0)
    } else {
      setNote(json.error || 'Failed to load — is the database initialised? Run: npm run setup')
    }
  }, [resource, page, search])

  useEffect(() => {
    load()
  }, [load])

  const openEditor = (row) => {
    const initial = {}
    for (const field of fields) {
      initial[field.name] = row ? fromRowValue(field, row[field.name]) : field.default ?? (field.type === 'switch' ? 1 : '')
    }
    setForm(initial)
    setEditing(row || {})
  }

  const save = async () => {
    setBusy(true)
    setNote('')
    const payload = {}
    for (const field of fields) payload[field.name] = toApiValue(field, form[field.name])
    const isNew = !editing?.id
    const res = await fetch(isNew ? `/api/admin/${resource}` : `/api/admin/${resource}/${editing.id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    setBusy(false)
    if (!res.ok) {
      setNote(json.error || 'Save failed')
      return
    }
    setEditing(null)
    load()
  }

  const remove = async (row) => {
    if (!confirm(`Delete "${row.title || row.name || row.label || row.question || row.author || `#${row.id}`}"? This cannot be undone.`)) return
    await fetch(`/api/admin/${resource}/${row.id}`, { method: 'DELETE' })
    load()
  }

  const toggle = async (row) => {
    await fetch(`/api/admin/${resource}/${row.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [toggleField]: Number(row[toggleField]) ? 0 : 1 }),
    })
    load()
  }

  const pages = Math.max(1, Math.ceil(total / perPage))

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
          <input
            className="a-input"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--line-strong)', borderRadius: 9, padding: '0.55rem 0.9rem', color: 'var(--ink)' }}
            placeholder="Search…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
          {!readOnly && (
            <button type="button" className="a-btn" onClick={() => openEditor(null)}>+ New</button>
          )}
        </div>
      </div>

      {note && <p className="form-note form-err" style={{ marginBottom: '1rem' }}>{note}</p>}

      <div className="a-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="a-table">
          <thead>
            <tr>
              {columns.map((col) => <th key={col.key}>{col.label}</th>)}
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={columns.length + 1} style={{ textAlign: 'center', color: 'var(--faint)', padding: '2rem' }}>Nothing here yet.</td></tr>
            )}
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => <td key={col.key}><CellValue col={col} row={row} /></td>)}
                <td>
                  <div className="row-actions">
                    {toggleField && (
                      <button type="button" className="a-btn ghost sm" onClick={() => toggle(row)}>
                        {Number(row[toggleField]) ? 'Mark unread' : 'Mark read'}
                      </button>
                    )}
                    {!readOnly && (
                      <button type="button" className="a-btn ghost sm" onClick={() => openEditor(row)}>Edit</button>
                    )}
                    <button type="button" className="a-btn danger sm" onClick={() => remove(row)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginTop: '1.2rem' }}>
          <button type="button" className="a-btn ghost sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
          <span className="a-badge">{page} / {pages}</span>
          <button type="button" className="a-btn ghost sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next →</button>
        </div>
      )}

      {editing !== null && (
        <div className="a-modal-overlay" onClick={() => setEditing(null)}>
          <div className="a-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing.id ? `Edit #${editing.id}` : `New ${title.replace(/s$/, '').toLowerCase()}`}</h2>
            <div className="a-grid cols-2">
              {fields.map((field) => (
                <div
                  className="field"
                  key={field.name}
                  style={field.half ? undefined : { gridColumn: '1 / -1' }}
                >
                  <label htmlFor={`f-${field.name}`}>{field.label}</label>
                  <FieldInput
                    field={field}
                    value={form[field.name]}
                    onChange={(v) => setForm((f) => ({ ...f, [field.name]: v }))}
                  />
                  {field.hint && <span style={{ fontSize: '0.74rem', color: 'var(--faint)' }}>{field.hint}</span>}
                </div>
              ))}
            </div>
            {note && <p className="form-note form-err">{note}</p>}
            <div className="modal-actions">
              <button type="button" className="a-btn ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button type="button" className="a-btn" onClick={save} disabled={busy}>
                {busy ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
