import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET: List all users
export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true, updatedAt: true }
  })
  return NextResponse.json(users)
}

// POST: Create a new user
export async function POST(request: NextRequest) {
  const { name, email, password, role, active } = await request.json()
  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Nombre, email y contraseña son requeridos' }, { status: 400 })
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      active: typeof active === 'boolean' ? active : true,
    }
  })
  return NextResponse.json({ id: user.id })
}
