import { NextResponse } from 'next/server'
import { checkCredentials, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth'

export async function POST(req) {
  const { user, password } = await req.json().catch(() => ({}))
  if (!checkCredentials(user, password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const token = await createSessionToken(user || 'admin')
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
  return res
}
