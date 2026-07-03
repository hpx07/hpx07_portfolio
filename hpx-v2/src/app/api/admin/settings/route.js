import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSettings, saveSettings } from '@/lib/repos'

export async function GET() {
  const settings = await getSettings()
  return NextResponse.json(settings)
}

export async function PUT(req) {
  try {
    const patch = await req.json()
    await saveSettings(patch)
    revalidatePath('/', 'layout')
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
