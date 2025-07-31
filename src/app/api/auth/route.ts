import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { getJWTSecret } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  console.log('=== AUTH ENDPOINT START ===')
  console.log('Request method:', request.method)
  console.log('Request URL:', request.url)
  
  try {
    // Verificar configuración de base de datos
    if (!prisma) {
      console.error('Prisma client not available')
      return NextResponse.json(
        { message: 'Base de datos no configurada' },
        { status: 500 }
      )
    }

    const body = await request.json()
    console.log('Request body received:', { email: body.email, hasPassword: !!body.password })
    
    const { email, password } = body

    if (!email || !password) {
      console.log('Missing credentials:', { hasEmail: !!email, hasPassword: !!password })
      return NextResponse.json(
        { message: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    console.log('Searching for user with email:', email)
    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    })
    console.log('User found:', !!user)

    if (!user) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    console.log('Verifying password...')
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log('Password valid:', isValidPassword)
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Generar JWT
    console.log('Generating JWT token...')
    const jwtSecret = getJWTSecret()
    console.log('JWT secret available:', !!jwtSecret)

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    )
    console.log('JWT token generated successfully')

    console.log('=== AUTH ENDPOINT SUCCESS ===')
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active
      }
    })

  } catch (error) {
    console.error('Error en login:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('Environment variables check:', {
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV
    })
    
    // Mostrar detalles del error para debugging (temporal)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const detailedMessage = `Error interno del servidor: ${errorMessage}`
    
    return NextResponse.json(
      { 
        message: detailedMessage,
        error: errorMessage, // Siempre mostrar para debugging
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
