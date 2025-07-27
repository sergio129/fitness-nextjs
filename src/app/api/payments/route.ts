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
    return jwt.verify(token, JWT_SECRET) as any
  } catch (error) {
    throw new Error("Token inválido")
  }
}

export async function GET(request: NextRequest) {
  try {
    verifyToken(request)

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const where: any = {}

    if (search) {
      where.member = {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { document: { contains: search, mode: "insensitive" } }
        ]
      }
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          member: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              document: true
            }
          }
        },
        orderBy: { paymentDate: "desc" },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.payment.count({ where })
    ])

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    console.error("Error en GET payments:", error)
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
    if (!data.memberId || !data.amount || !data.paymentType) {
      return NextResponse.json(
        { error: "Afiliado, monto y tipo de pago son requeridos" },
        { status: 400 }
      )
    }

    // Verificar que el miembro existe
    const member = await prisma.member.findUnique({
      where: { id: data.memberId }
    })

    if (!member) {
      return NextResponse.json(
        { error: "Afiliado no encontrado" },
        { status: 404 }
      )
    }

    // Crear el pago
    const payment = await prisma.payment.create({
      data: {
        memberId: data.memberId,
        amount: data.amount,
        paymentType: data.paymentType,
        notes: data.notes || null,
        paymentDate: new Date()
      },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            document: true
          }
        }
      }
    })

    // Si es un pago de membresía, actualizar la fecha del próximo pago
    if (data.paymentType === "MEMBERSHIP") {
      const nextPaymentDate = new Date()
      
      if (member.membershipType === "ANNUAL") {
        nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1)
      } else {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)
      }

      await prisma.member.update({
        where: { id: data.memberId },
        data: { 
          nextPaymentDate,
          isActive: true // Reactivar el miembro si estaba inactivo
        }
      })
    }

    return NextResponse.json(payment, { status: 201 })

  } catch (error: any) {
    console.error("Error en POST payments:", error)
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: error.message === "Token no proporcionado" || error.message === "Token inválido" ? 401 : 500 }
    )
  }
}
