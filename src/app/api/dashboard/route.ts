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
    return jwt.verify(token, JWT_SECRET!) as any
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
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Obtener estadísticas en paralelo
    const [
      totalMembers,
      activeMembers,
      monthlyPayments,
      lastMonthPayments,
      totalMonthlyRevenue,
      lastMonthRevenue,
      recentPayments,
      membersExpiringSoon,
      membersExpiredOverdue,
      paymentsByType,
      newMembersThisMonth
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

      // Pagos del mes pasado
      prisma.payment.count({
        where: {
          paymentDate: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
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

      // Ingresos del mes pasado
      prisma.payment.aggregate({
        _sum: {
          amount: true
        },
        where: {
          paymentDate: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),
      
      // Últimos pagos (10 más recientes)
      prisma.payment.findMany({
        take: 10,
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
            gte: now,
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
      }),

      // Miembros con membresías vencidas (más de 0 días vencidos)
      prisma.member.findMany({
        where: {
          isActive: true,
          nextPaymentDate: {
            lt: now
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
      }),

      // Pagos por tipo este mes
      prisma.payment.groupBy({
        by: ['paymentType'],
        _count: {
          id: true
        },
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

      // Nuevos miembros este mes
      prisma.member.count({
        where: {
          registrationDate: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      })
    ])

    // Calcular porcentajes de cambio
    const currentRevenue = Number(totalMonthlyRevenue._sum.amount || 0)
    const lastRevenue = Number(lastMonthRevenue._sum.amount || 0)
    
    const paymentsGrowth = lastMonthPayments > 0 
      ? ((monthlyPayments - lastMonthPayments) / lastMonthPayments) * 100 
      : 0
    
    const revenueGrowth = lastRevenue > 0 
      ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 
      : 0

    const stats = {
      totalMembers,
      activeMembers,
      inactiveMembers: totalMembers - activeMembers,
      newMembersThisMonth,
      monthlyPayments,
      paymentsGrowth: Math.round(paymentsGrowth * 100) / 100,
      monthlyRevenue: currentRevenue,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      averagePayment: monthlyPayments > 0 ? Math.round(currentRevenue / monthlyPayments) : 0,
      recentPayments,
      membersExpiringSoon,
      membersExpiredOverdue,
      paymentsByType,
      // Estadísticas adicionales
      membershipRetention: totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0,
      avgMonthlyFeeActive: activeMembers > 0 ? await prisma.member.aggregate({
        _avg: { monthlyFee: true },
        where: { isActive: true }
      }).then(result => Math.round(Number(result._avg.monthlyFee) || 0)) : 0
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
