"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/Layout"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { apiClient } from "@/utils/api"
import { Bell, AlertTriangle, Calendar, DollarSign, Users } from "lucide-react"

interface Alert {
  id: string
  type: 'PAYMENT_DUE' | 'PAYMENT_OVERDUE' | 'MEMBERSHIP_EXPIRING' | 'SYSTEM'
  title: string
  message: string
  member?: {
    id: string
    firstName: string
    lastName: string
    document: string
  }
  dueDate?: string
  amount?: number
  isRead: boolean
  createdAt: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const data = await apiClient.request<Alert[]>('/alerts')
      setAlerts(data)
    } catch (error) {
      console.error('Error al cargar alertas:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (alertId: string) => {
    try {
      await apiClient.request(`/alerts/${alertId}/read`, { method: 'PATCH' })
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      ))
    } catch (error) {
      console.error('Error al marcar alerta como leída:', error)
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'PAYMENT_DUE':
        return <Calendar className="w-5 h-5 text-yellow-600" />
      case 'PAYMENT_OVERDUE':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'MEMBERSHIP_EXPIRING':
        return <Users className="w-5 h-5 text-blue-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getAlertBadgeClass = (type: string) => {
    switch (type) {
      case 'PAYMENT_DUE':
        return 'badge-warning'
      case 'PAYMENT_OVERDUE':
        return 'badge-danger'
      case 'MEMBERSHIP_EXPIRING':
        return 'badge-info'
      default:
        return 'badge-primary'
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "all") return true
    if (filter === "unread") return !alert.isRead
    return alert.type === filter
  })

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Alertas</h1>
              <p className="text-gray-600">Gestiona las notificaciones del sistema</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Todas ({alerts.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === "unread"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              No leídas ({alerts.filter(a => !a.isRead).length})
            </button>
            <button
              onClick={() => setFilter("PAYMENT_DUE")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === "PAYMENT_DUE"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Próximos a vencer
            </button>
            <button
              onClick={() => setFilter("PAYMENT_OVERDUE")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === "PAYMENT_OVERDUE"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Vencidos
            </button>
          </div>

          {/* Lista de alertas */}
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay alertas</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === "all" 
                    ? "No tienes alertas en este momento." 
                    : "No hay alertas que coincidan con el filtro seleccionado."
                  }
                </p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`card p-4 border-l-4 ${
                    alert.isRead 
                      ? 'border-gray-300 bg-gray-50' 
                      : alert.type === 'PAYMENT_OVERDUE' 
                        ? 'border-red-500 bg-red-50'
                        : alert.type === 'PAYMENT_DUE'
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {alert.title}
                          </h3>
                          <span className={`badge ${getAlertBadgeClass(alert.type)}`}>
                            {alert.type === 'PAYMENT_DUE' ? 'Próximo a vencer' :
                             alert.type === 'PAYMENT_OVERDUE' ? 'Vencido' :
                             alert.type === 'MEMBERSHIP_EXPIRING' ? 'Membresía expirando' :
                             'Sistema'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {new Date(alert.createdAt).toLocaleDateString()}
                          </span>
                          {!alert.isRead && (
                            <button
                              onClick={() => markAsRead(alert.id)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Marcar como leída
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {alert.message}
                      </p>
                      {alert.member && (
                        <div className="mt-2 text-xs text-gray-500">
                          <strong>Afiliado:</strong> {alert.member.firstName} {alert.member.lastName} 
                          ({alert.member.document})
                        </div>
                      )}
                      {alert.amount && (
                        <div className="mt-1 text-xs text-gray-500">
                          <strong>Monto:</strong> {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                          }).format(alert.amount)}
                        </div>
                      )}
                      {alert.dueDate && (
                        <div className="mt-1 text-xs text-gray-500">
                          <strong>Fecha de vencimiento:</strong> {new Date(alert.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
