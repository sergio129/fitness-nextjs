'use client';

import { useState, useEffect } from 'react';
import { AuthWrapper } from '@/components/AuthWrapper';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { apiClient } from '@/utils/api';

// Componente Layout inline para evitar problemas de importación
function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

interface Dashboard {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  monthlyPayments: number;
  monthlyRevenue: number;
  averagePayment: number;
  recentPayments: Payment[];
  membersExpiringSoon: MemberAlert[];
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
            <div className="p-6">
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
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
            
            {dashboard && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card">
                  <h3 className="text-sm font-medium text-gray-600">Total Afiliados</h3>
                  <p className="text-2xl font-bold text-gray-900">{dashboard.totalMembers || 0}</p>
                </div>
                
                <div className="card">
                  <h3 className="text-sm font-medium text-gray-600">Afiliados Activos</h3>
                  <p className="text-2xl font-bold text-green-600">{dashboard.activeMembers || 0}</p>
                </div>
                
                <div className="card">
                  <h3 className="text-sm font-medium text-gray-600">Ingresos del Mes</h3>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(dashboard.monthlyRevenue || 0)}</p>
                </div>
                
                <div className="card">
                  <h3 className="text-sm font-medium text-gray-600">Pagos del Mes</h3>
                  <p className="text-2xl font-bold text-purple-600">{dashboard.monthlyPayments || 0}</p>
                </div>
              </div>
            )}

            {/* Sección de miembros próximos a vencer */}
            {dashboard?.membersExpiringSoon && dashboard.membersExpiringSoon.length > 0 && (
              <div className="card mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Próximos a Vencer
                </h3>
                <div className="space-y-3">
                  {dashboard.membersExpiringSoon.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Doc: {member.document}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-yellow-800">
                          {member.nextPaymentDate && new Date(member.nextPaymentDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatCurrency(member.monthlyFee)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sección de pagos recientes */}
            {dashboard?.recentPayments && dashboard.recentPayments.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Pagos Recientes
                </h3>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Afiliado</th>
                        <th>Monto</th>
                        <th>Tipo</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.recentPayments.map((payment) => (
                        <tr key={payment.id}>
                          <td>
                            {payment.member ? 
                              `${payment.member.firstName} ${payment.member.lastName}` : 
                              'N/A'
                            }
                          </td>
                          <td>{formatCurrency(payment.amount)}</td>
                          <td>
                            <span className={`badge ${
                              payment.paymentType === 'MONTHLY' ? 'badge-success' : 
                              payment.paymentType === 'ANNUAL' ? 'badge-primary' :
                              payment.paymentType === 'REGISTRATION' ? 'badge-info' :
                              'badge-warning'
                            }`}>
                              {getPaymentTypeName(payment.paymentType)}
                            </span>
                          </td>
                          <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
