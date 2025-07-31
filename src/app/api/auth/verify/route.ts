import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getJWTSecret } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token no proporcionado" },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    try {
      const decoded = jwt.verify(token, getJWTSecret()) as any
      
      return NextResponse.json({
        isValid: true,
        user: {
          id: decoded.userId,
          email: decoded.email
        }
      })
    } catch (error) {
      return NextResponse.json(
        { error: "Token inválido", isValid: false },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error("Error en verify:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
