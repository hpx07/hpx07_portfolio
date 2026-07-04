import { NextResponse } from 'next/server'
import { runHealthChecks } from '@/lib/repos'

export const maxDuration = 60

export async function POST() {
  try {
    const results = await runHealthChecks()
    return NextResponse.json({ ok: true, results })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
