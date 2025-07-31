import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET: Get user by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true, updatedAt: true }
  })
  if (!user) return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 })
  return NextResponse.json(user)
}

// PUT: Update user by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const { name, email, password, role, active } = await request.json()
  let data: any = { name, email, role, active }
  if (password) {
    data.password = await bcrypt.hash(password, 10)
  }
  const user = await prisma.user.update({
    where: { id },
    data
  })
  return NextResponse.json({ id: user.id })
}

// DELETE: Delete user by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ message: 'Usuario eliminado' })
}
