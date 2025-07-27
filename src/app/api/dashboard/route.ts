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

export async function GET(request: NextRequest) {
  try {
    verifyToken(request)

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Obtener estadísticas en paralelo
    const [
      totalMembers,
      activeMembers,
      monthlyPayments,
      totalMonthlyRevenue,
      recentPayments,
      membersExpiringSoon
    ] = await Promise.all([
      // Total de miembros
      prisma.member.count(),
      
      // Miembros activos
      prisma.member.count({
        where: { isActive: true }
      }),
      
      // Pagos del mes actual
      prisma.payment.count({
        where: {
          paymentDate: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      }),
      
      // Ingresos del mes actual
      prisma.payment.aggregate({
        _sum: {
          amount: true
        },
        where: {
          paymentDate: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      }),
      
      // Últimos pagos (5 más recientes)
      prisma.payment.findMany({
        take: 5,
        orderBy: { paymentDate: "desc" },
        include: {
          member: {
            select: {
              firstName: true,
              lastName: true,
              document: true
            }
          }
        }
      }),
      
      // Miembros con membresías próximas a vencer (próximos 7 días)
      prisma.member.findMany({
        where: {
          isActive: true,
          nextPaymentDate: {
            lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 días desde ahora
          }
        },
        take: 10,
        orderBy: { nextPaymentDate: "asc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          document: true,
          nextPaymentDate: true,
          membershipType: true,
          monthlyFee: true
        }
      })
    ])

    const stats = {
      totalMembers,
      activeMembers,
      inactiveMembers: totalMembers - activeMembers,
      monthlyPayments,
      monthlyRevenue: totalMonthlyRevenue._sum.amount || 0,
      averagePayment: monthlyPayments > 0 ? (totalMonthlyRevenue._sum.amount || 0) / monthlyPayments : 0,
      recentPayments,
      membersExpiringSoon
    }

    return NextResponse.json(stats)

  } catch (error: any) {
    console.error("Error en GET dashboard:", error)
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: error.message === "Token no proporcionado" || error.message === "Token inválido" ? 401 : 500 }
    )
  }
}
