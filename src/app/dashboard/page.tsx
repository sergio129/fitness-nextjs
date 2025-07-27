"use client"

import { useState, useEffect } from 'react';
import { ProtectedRoute } from "@/components/ProtectedRoute"
import Layout from "@/components/Layout"
import { formatCurrency } from '@/utils/currency';
import { Users, CreditCard, DollarSign, UserCheck, AlertTriangle } from 'lucide-react';

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  monthlyRevenue: number;
  totalPaymentsThisMonth: number;
  membersWithPaymentsDue: number;
  membersWithOverduePayments: number;
}

const Dashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulando carga de datos del dashboard
    const fetchDashboard = async () => {
      try {
        // En el futuro esto será una llamada real a la API
        const mockData: DashboardStats = {
          totalMembers: 0,
          activeMembers: 0,
          inactiveMembers: 0,
          monthlyRevenue: 0,
          totalPaymentsThisMonth: 0,
          membersWithPaymentsDue: 0,
          membersWithOverduePayments: 0,
        };
        setDashboard(mockData);
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!dashboard) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="text-center text-gray-500">
            Error al cargar los datos del dashboard
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const stats = [
    {
      name: "Total Afiliados",
      value: dashboard.totalMembers,
      icon: Users,
      color: "bg-blue-500"
    },
    {
      name: "Afiliados Activos",
      value: dashboard.activeMembers,
      icon: UserCheck,
      color: "bg-green-500"
    },
    {
      name: "Próximos a Vencer",
      value: dashboard.membersWithPaymentsDue,
      icon: AlertTriangle,
      color: "bg-yellow-500"
    },
    {
      name: "Pagos Vencidos",
      value: dashboard.membersWithOverduePayments,
      icon: AlertTriangle,
      color: "bg-red-500"
    }
  ];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Título */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Resumen general del gimnasio</p>
          </div>

          {/* Estadísticas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StatCard
                key={stat.name}
                title={stat.name}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </div>

          {/* Ingresos del mes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Ingresos del Mes
              </h3>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(dashboard.monthlyRevenue)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {dashboard.totalPaymentsThisMonth} pagos realizados
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Resumen de Membresías
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Activos:</span>
                  <span className="font-medium">{dashboard.activeMembers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Inactivos:</span>
                  <span className="font-medium">{dashboard.inactiveMembers}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mensaje de desarrollo */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <DollarSign className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Dashboard en desarrollo:</strong> Las estadísticas se mostrarán aquí una vez que haya datos de afiliados y pagos en el sistema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 w-8 h-8 ${color} rounded-full flex items-center justify-center text-white`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
