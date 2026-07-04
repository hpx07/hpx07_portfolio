import { NextResponse } from 'next/server'
import { createMessage } from '@/lib/repos'

// naive in-memory rate limit — one submission per 20s per IP
const lastHit = new Map()

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'local'
    const now = Date.now()
    if (lastHit.get(ip) && now - lastHit.get(ip) < 20000) {
      return NextResponse.json({ error: 'Too many messages — try again in a moment.' }, { status: 429 })
    }

    const data = await req.json()
    const name = String(data.name || '').trim().slice(0, 120)
    const email = String(data.email || '').trim().slice(0, 190)
    const body = String(data.body || '').trim().slice(0, 4000)
    if (!name || !body || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please fill in name, a valid email and a message.' }, { status: 400 })
    }

    await createMessage({
      name,
      email,
      subject: String(data.subject || '').trim().slice(0, 255),
      body,
      plan: String(data.plan || '').trim().slice(0, 96),
    })
    lastHit.set(ip, now)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: 'Could not save your message right now — email me directly instead.' },
      { status: 500 },
    )
  }
}
