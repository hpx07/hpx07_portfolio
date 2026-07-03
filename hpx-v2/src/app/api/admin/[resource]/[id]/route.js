import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { adminUpdate, adminDelete, RESOURCES } from '@/lib/repos'

export async function PUT(req, { params }) {
  const { resource, id } = await params
  if (!RESOURCES[resource]) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 })
  try {
    const data = await req.json()
    const result = await adminUpdate(resource, Number(id), data)
    revalidatePath('/', 'layout')
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const { resource, id } = await params
  if (!RESOURCES[resource]) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 })
  try {
    const result = await adminDelete(resource, Number(id))
    revalidatePath('/', 'layout')
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
