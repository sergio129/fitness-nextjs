"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { AuthWrapper } from "@/components/AuthWrapper"
import { apiClient } from "@/utils/api"
import { Bell, AlertTriangle, Calendar, Users } from "lucide-react"
import { useAuth } from '@/contexts/AuthContext';

// Layout con navegación completa como el repositorio original
function AlertsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Cerrar sidebar</span>
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-xl font-bold text-gray-900">🏋️ GYMControl</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                <a href="/dashboard" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <svg className="text-gray-400 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                  Dashboard
                </a>
                <a href="/members" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <svg className="text-gray-400 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                  Afiliados
                </a>
                <a href="/payments" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <svg className="text-gray-400 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Pagos
                </a>
                <a href="/alerts" className="bg-gray-100 text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <svg className="text-gray-500 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 3v13h5l-5 5v-5H7V3h5z" />
                  </svg>
                  Alertas
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">🏋️ GYMControl</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              <a href="/dashboard" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <svg className="text-gray-400 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                Dashboard
              </a>
              <a href="/members" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <svg className="text-gray-400 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                Afiliados
              </a>
              <a href="/payments" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <svg className="text-gray-400 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Pagos
              </a>
              <a href="/alerts" className="bg-gray-100 text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <svg className="text-gray-500 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 3v13h5l-5 5v-5H7V3h5z" />
                </svg>
                Alertas
              </a>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Admin</p>
                  <button 
                    onClick={handleLogout}
                    className="text-xs font-medium text-gray-500 group-hover:text-gray-700"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

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
      <AuthWrapper>
        <ProtectedRoute>
          <AlertsLayout>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          </AlertsLayout>
        </ProtectedRoute>
      </AuthWrapper>
    )
  }

  return (
    <AuthWrapper>
      <ProtectedRoute>
        <AlertsLayout>
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
      </AlertsLayout>
    </ProtectedRoute>
  </AuthWrapper>
  )
}
