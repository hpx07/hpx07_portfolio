import { NextResponse } from 'next/server'
import { trackView } from '@/lib/repos'

export async function POST(req) {
  try {
    const data = await req.json()
    if (!data?.path || String(data.path).startsWith('/admin')) {
      return NextResponse.json({ ok: true })
    }
    const device = ['mobile', 'tablet', 'desktop'].includes(data.device) ? data.device : ''
    await trackView({
      path: data.path,
      referrer: data.referrer || '',
      device,
      session_hash: String(data.session_hash || '').slice(0, 64),
    })
  } catch {
    /* tracking must never error toward the client */
  }
  return NextResponse.json({ ok: true })
}
