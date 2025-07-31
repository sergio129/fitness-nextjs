'use client';

import { useState, useEffect } from 'react';
import { AuthWrapper } from '@/components/AuthWrapper';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { apiClient } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';

// Layout con navegación completa como el repositorio original
function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
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
                <h1 className="text-xl font-bold text-gray-900">Fitness Admin</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                <a href="/dashboard" className="bg-blue-100 text-blue-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <svg className="text-blue-500 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <a href="/alerts" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <svg className="text-gray-400 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <h1 className="text-xl font-bold text-gray-900">Fitness Admin</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              <a href="/dashboard" className="bg-blue-100 text-blue-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <svg className="text-blue-500 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <a href="/alerts" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <svg className="text-gray-400 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

interface Dashboard {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newMembersThisMonth: number;
  monthlyPayments: number;
  paymentsGrowth: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  averagePayment: number;
  membershipRetention: number;
  avgMonthlyFeeActive: number;
  recentPayments: Payment[];
  membersExpiringSoon: MemberAlert[];
  membersExpiredOverdue: MemberAlert[];
  paymentsByType: Array<{
    paymentType: string;
    _count: { id: number };
    _sum: { amount: number };
  }>;
}

interface Payment {
  id: string;
  amount: number;
  paymentDate: string;
  paymentType: 'MONTHLY' | 'ANNUAL' | 'REGISTRATION' | 'PENALTY' | 'OTHER';
  description?: string;
  member?: {
    id: string;
    firstName: string;
    lastName: string;
    document: string;
  };
}

interface MemberAlert {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  nextPaymentDate?: string;
  monthlyFee: number;
}

function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await apiClient.getDashboard() as Dashboard;
        console.log('Dashboard data received:', data); // Debug log
        setDashboard(data);
      } catch (err) {
        console.error('Error al cargar el dashboard:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntilExpiry = (dateString: string) => {
    const today = new Date();
    const expiryDate = new Date(dateString);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return '↗️';
    if (growth < 0) return '↘️';
    return '➡️';
  };

  const getPaymentTypeName = (type: string) => {
    switch (type) {
      case 'MONTHLY':
        return 'Mensual';
      case 'ANNUAL':
        return 'Anual';
      case 'REGISTRATION':
        return 'Registro';
      case 'PENALTY':
        return 'Penalización';
      default:
        return 'Otro';
    }
  };

  if (loading) {
    return (
      <AuthWrapper>
        <ProtectedRoute>
          <Layout>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          </Layout>
        </ProtectedRoute>
      </AuthWrapper>
    );
  }

  if (error) {
    return (
      <AuthWrapper>
        <ProtectedRoute>
          <Layout>
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-red-800 font-medium">Error al cargar el dashboard</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Intentar de nuevo
              </button>
            </div>
          </Layout>
        </ProtectedRoute>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <ProtectedRoute>
        <Layout>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
            
            {dashboard && (
              <>
                {/* Estadísticas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-blue-100">Total Afiliados</h3>
                        <p className="text-3xl font-bold">{dashboard.totalMembers || 0}</p>
                        <p className="text-xs text-blue-100 mt-1">
                          Nuevos este mes: +{dashboard.newMembersThisMonth || 0}
                        </p>
                      </div>
                      <div className="text-4xl opacity-20">👥</div>
                    </div>
                  </div>
                  
                  <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-green-100">Afiliados Activos</h3>
                        <p className="text-3xl font-bold">{dashboard.activeMembers || 0}</p>
                        <p className="text-xs text-green-100 mt-1">
                          Retención: {dashboard.membershipRetention || 0}%
                        </p>
                      </div>
                      <div className="text-4xl opacity-20">✅</div>
                    </div>
                  </div>
                  
                  <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-purple-100">Ingresos del Mes</h3>
                        <p className="text-2xl font-bold">{formatCurrency(dashboard.monthlyRevenue || 0)}</p>
                        <p className={`text-xs mt-1 ${dashboard.revenueGrowth >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                          {getGrowthIcon(dashboard.revenueGrowth)} {dashboard.revenueGrowth > 0 ? '+' : ''}{dashboard.revenueGrowth}% vs mes anterior
                        </p>
                      </div>
                      <div className="text-4xl opacity-20">💰</div>
                    </div>
                  </div>
                  
                  <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-orange-100">Pagos del Mes</h3>
                        <p className="text-3xl font-bold">{dashboard.monthlyPayments || 0}</p>
                        <p className={`text-xs mt-1 ${dashboard.paymentsGrowth >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                          {getGrowthIcon(dashboard.paymentsGrowth)} {dashboard.paymentsGrowth > 0 ? '+' : ''}{dashboard.paymentsGrowth}% vs mes anterior
                        </p>
                      </div>
                      <div className="text-4xl opacity-20">📊</div>
                    </div>
                  </div>
                </div>

                {/* Estadísticas adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="card">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Pago Promedio</h3>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboard.averagePayment || 0)}</p>
                  </div>
                  
                  <div className="card">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Cuota Mensual Promedio</h3>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboard.avgMonthlyFeeActive || 0)}</p>
                  </div>
                  
                  <div className="card">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Afiliados Inactivos</h3>
                    <p className="text-2xl font-bold text-red-600">{dashboard.inactiveMembers || 0}</p>
                  </div>
                </div>

                {/* Alertas importantes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Membresías vencidas */}
                  {dashboard.membersExpiredOverdue && dashboard.membersExpiredOverdue.length > 0 && (
                    <div className="card border-l-4 border-red-500">
                      <div className="flex items-center mb-4">
                        <div className="text-2xl mr-3">⚠️</div>
                        <h3 className="text-lg font-medium text-red-800">
                          Membresías Vencidas ({dashboard.membersExpiredOverdue.length})
                        </h3>
                      </div>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {dashboard.membersExpiredOverdue.map((member) => {
                          const daysOverdue = Math.abs(getDaysUntilExpiry(member.nextPaymentDate || ''));
                          return (
                            <div key={member.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                              <div>
                                <p className="font-medium text-red-900">
                                  {member.firstName} {member.lastName}
                                </p>
                                <p className="text-sm text-red-700">
                                  Doc: {member.document}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-red-800">
                                  Vencido hace {daysOverdue} día{daysOverdue !== 1 ? 's' : ''}
                                </p>
                                <p className="text-xs text-red-600">
                                  {formatCurrency(Number(member.monthlyFee))}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Próximos a vencer */}
                  {dashboard.membersExpiringSoon && dashboard.membersExpiringSoon.length > 0 && (
                    <div className="card border-l-4 border-yellow-500">
                      <div className="flex items-center mb-4">
                        <div className="text-2xl mr-3">⏰</div>
                        <h3 className="text-lg font-medium text-yellow-800">
                          Próximos a Vencer ({dashboard.membersExpiringSoon.length})
                        </h3>
                      </div>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {dashboard.membersExpiringSoon.map((member) => {
                          const daysUntil = getDaysUntilExpiry(member.nextPaymentDate || '');
                          return (
                            <div key={member.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                              <div>
                                <p className="font-medium text-yellow-900">
                                  {member.firstName} {member.lastName}
                                </p>
                                <p className="text-sm text-yellow-700">
                                  Doc: {member.document}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-yellow-800">
                                  {daysUntil === 0 ? 'Hoy' : 
                                   daysUntil === 1 ? 'Mañana' : 
                                   `En ${daysUntil} días`}
                                </p>
                                <p className="text-xs text-yellow-600">
                                  {formatCurrency(Number(member.monthlyFee))}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Distribución de pagos por tipo */}
                {dashboard.paymentsByType && dashboard.paymentsByType.length > 0 && (
                  <div className="card mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      📈 Distribución de Pagos por Tipo (Este Mes)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dashboard.paymentsByType.map((type) => (
                        <div key={type.paymentType} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900">
                            {getPaymentTypeName(type.paymentType)}
                          </h4>
                          <p className="text-2xl font-bold text-blue-600">
                            {formatCurrency(Number(type._sum.amount || 0))}
                          </p>
                          <p className="text-sm text-gray-600">
                            {type._count.id} pago{type._count.id !== 1 ? 's' : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Sección de pagos recientes */}
            {dashboard?.recentPayments && dashboard.recentPayments.length > 0 && (
              <div className="card">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">💳</div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Pagos Recientes
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Afiliado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Monto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboard.recentPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-blue-600">
                                  {payment.member ? 
                                    (payment.member.firstName.charAt(0) + payment.member.lastName.charAt(0)).toUpperCase() : 
                                    'N/A'
                                  }
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {payment.member ? 
                                    `${payment.member.firstName} ${payment.member.lastName}` : 
                                    'N/A'
                                  }
                                </div>
                                <div className="text-sm text-gray-500">
                                  {payment.member?.document || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(payment.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              payment.paymentType === 'MONTHLY' ? 'bg-green-100 text-green-800' : 
                              payment.paymentType === 'ANNUAL' ? 'bg-blue-100 text-blue-800' :
                              payment.paymentType === 'REGISTRATION' ? 'bg-purple-100 text-purple-800' :
                              payment.paymentType === 'PENALTY' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {getPaymentTypeName(payment.paymentType)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(payment.paymentDate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-center">
                  <a 
                    href="/payments" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
                  >
                    Ver todos los pagos
                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </Layout>
      </ProtectedRoute>
    </AuthWrapper>
  );
}

export default DashboardPage;

// Estilos CSS adicionales
const styles = `
  .card {
    @apply bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200;
  }
  
  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
  }
  
  .badge-success {
    @apply bg-green-100 text-green-800;
  }
  
  .badge-primary {
    @apply bg-blue-100 text-blue-800;
  }
  
  .badge-info {
    @apply bg-cyan-100 text-cyan-800;
  }
  
  .badge-warning {
    @apply bg-yellow-100 text-yellow-800;
  }
  
  .table {
    @apply min-w-full divide-y divide-gray-200;
  }
  
  .table th {
    @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50;
  }
  
  .table td {
    @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900;
  }
`;

// Inyectar estilos si no existen
if (typeof document !== 'undefined' && !document.getElementById('dashboard-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'dashboard-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
