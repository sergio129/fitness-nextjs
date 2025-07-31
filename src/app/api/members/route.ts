import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no está configurado")
}

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token no proporcionado")
  }

  const token = authHeader.substring(7)
  
  try {
    return jwt.verify(token, JWT_SECRET!) as any
  } catch (error) {
    throw new Error("Token inválido")
  }
}

export async function GET(request: NextRequest) {
  try {
    verifyToken(request)

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const isActive = searchParams.get("isActive")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const where: any = {}

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { document: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }
      ]
    }

    if (isActive !== null && isActive !== "") {
      where.isActive = isActive === "true"
    }

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.member.count({ where })
    ])

    return NextResponse.json({
      members,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    console.error("Error en GET members:", error)
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: error.message === "Token no proporcionado" || error.message === "Token inválido" ? 401 : 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    verifyToken(request)

    const data = await request.json()
    
    // Validar campos requeridos
    if (!data.firstName || !data.lastName || !data.document) {
      return NextResponse.json(
        { error: "Nombre, apellido y documento son requeridos" },
        { status: 400 }
      )
    }

    // Verificar si el documento ya existe
    const existingMember = await prisma.member.findUnique({
      where: { document: data.document }
    })

    if (existingMember) {
      return NextResponse.json(
        { error: "Ya existe un afiliado con este documento" },
        { status: 409 }
      )
    }

    // Calcular fecha del próximo pago
    const now = new Date()
    const nextPaymentDate = new Date(now)
    
    if (data.membershipType === "ANNUAL") {
      nextPaymentDate.setFullYear(now.getFullYear() + 1)
    } else {
      nextPaymentDate.setMonth(now.getMonth() + 1)
    }

    const member = await prisma.member.create({
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
        notes: data.notes || null,
        nextPaymentDate,
        isActive: true
      }
    })

    return NextResponse.json(member, { status: 201 })

  } catch (error: any) {
    console.error("Error en POST members:", error)
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: error.message === "Token no proporcionado" || error.message === "Token inválido" ? 401 : 500 }
    )
  }
}
