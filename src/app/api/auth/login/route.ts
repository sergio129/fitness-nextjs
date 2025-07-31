import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { getJWTSecret } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "Email y password son requeridos" },
        { status: 400 }
      )
    }

    // Buscar el admin en la base de datos
    const admin = await prisma.admin.findUnique({
      where: { email: username }
    })

    if (!admin) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    // Verificar la contraseña
    const isValidPassword = await bcrypt.compare(password, admin.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    // Generar token JWT
    const jwtSecret = getJWTSecret()

    const token = jwt.sign(
      { 
        adminId: admin.id, 
        email: admin.email 
      },
      jwtSecret,
      { expiresIn: "7d" }
    )

    return NextResponse.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    })

  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
