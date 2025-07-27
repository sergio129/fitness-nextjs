import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Buscar admin por email
    const admin = await prisma.admin.findUnique({
      where: { email }
    })

    if (!admin) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, admin.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Generar JWT
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      return NextResponse.json(
        { message: 'Configuración del servidor incorrecta' },
        { status: 500 }
      )
    }

    const token = jwt.sign(
      { adminId: admin.id },
      jwtSecret,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    })

  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
