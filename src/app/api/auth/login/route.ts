import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no está configurado")
}

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
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET no está configurado")
    }

    const token = jwt.sign(
      { 
        adminId: admin.id, 
        email: admin.email 
      },
      JWT_SECRET,
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
