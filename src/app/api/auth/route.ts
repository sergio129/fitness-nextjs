import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { getJWTSecret } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    // Verificar configuración de base de datos
    if (!prisma) {
      return NextResponse.json(
        { message: 'Base de datos no configurada' },
        { status: 500 }
      )
    }

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
    const jwtSecret = getJWTSecret()

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
    
    // Proporcionar más detalles del error en desarrollo
    let errorMessage = 'Error interno del servidor'
    if (process.env.NODE_ENV === 'development') {
      errorMessage = `Error interno del servidor: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
    
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    )
  }
}
