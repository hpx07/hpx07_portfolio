import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const ALLOWED = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/x-icon': '.ico',
  'image/vnd.microsoft.icon': '.ico',
  'image/gif': '.gif',
}
const MAX_BYTES = 4 * 1024 * 1024

export async function POST(req) {
  try {
    const form = await req.formData()
    const file = form.get('file')
    const kind = String(form.get('kind') || 'media').replace(/[^a-z0-9-]/gi, '') || 'media'
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file supplied' }, { status: 400 })
    }
    const ext = ALLOWED[file.type]
    if (!ext) return NextResponse.json({ error: `Unsupported type ${file.type}` }, { status: 400 })
    if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File too large (max 4 MB)' }, { status: 400 })

    const bytes = Buffer.from(await file.arrayBuffer())
    const name = `${kind}-${Date.now()}${ext}`
    const dir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, name), bytes)
    return NextResponse.json({ url: `/uploads/${name}` })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
