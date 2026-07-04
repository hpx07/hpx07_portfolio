import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { adminList, adminCreate, RESOURCES } from '@/lib/repos'

export async function GET(req, { params }) {
  const { resource } = await params
  if (!RESOURCES[resource]) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 })
  try {
    const url = new URL(req.url)
    const data = await adminList(resource, {
      page: Number(url.searchParams.get('page')) || 1,
      perPage: Math.min(200, Number(url.searchParams.get('perPage')) || 50),
      search: url.searchParams.get('q') || '',
    })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req, { params }) {
  const { resource } = await params
  if (!RESOURCES[resource]) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 })
  try {
    const data = await req.json()
    const result = await adminCreate(resource, data)
    revalidatePath('/', 'layout')
    return NextResponse.json(result, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
