import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token no proporcionado")
  }

  const token = authHeader.substring(7)
  
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch (error) {
    throw new Error("Token inválido")
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    verifyToken(request)

    const data = await request.json()
    const memberId = params.id

    // Validar campos requeridos
    if (!data.firstName || !data.lastName || !data.document) {
      return NextResponse.json(
        { error: "Nombre, apellido y documento son requeridos" },
        { status: 400 }
      )
    }

    // Verificar si el miembro existe
    const existingMember = await prisma.member.findUnique({
      where: { id: memberId }
    })

    if (!existingMember) {
      return NextResponse.json(
        { error: "Afiliado no encontrado" },
        { status: 404 }
      )
    }

    // Verificar si el documento ya existe en otro miembro
    if (data.document !== existingMember.document) {
      const memberWithDocument = await prisma.member.findUnique({
        where: { document: data.document }
      })

      if (memberWithDocument) {
        return NextResponse.json(
          { error: "Ya existe un afiliado con este documento" },
          { status: 409 }
        )
      }
    }

    const member = await prisma.member.update({
      where: { id: memberId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        document: data.document,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        membershipType: data.membershipType || "MONTHLY",
        monthlyFee: data.monthlyFee,
        notes: data.notes || null
      }
    })

    return NextResponse.json(member)

  } catch (error: any) {
    console.error("Error en PUT member:", error)
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: error.message === "Token no proporcionado" || error.message === "Token inválido" ? 401 : 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    verifyToken(request)

    const memberId = params.id

    // Verificar si el miembro existe
    const existingMember = await prisma.member.findUnique({
      where: { id: memberId }
    })

    if (!existingMember) {
      return NextResponse.json(
        { error: "Afiliado no encontrado" },
        { status: 404 }
      )
    }

    // Eliminar el miembro
    await prisma.member.delete({
      where: { id: memberId }
    })

    return NextResponse.json({ message: "Afiliado eliminado exitosamente" })

  } catch (error: any) {
    console.error("Error en DELETE member:", error)
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: error.message === "Token no proporcionado" || error.message === "Token inválido" ? 401 : 500 }
    )
  }
}
