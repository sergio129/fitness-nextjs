'use client';

import { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { ProtectedRoute } from './ProtectedRoute';
import { apiClient } from '@/utils/api';
import { 
  UsersIcon, 
  CurrencyDollarIcon, 
  CalendarIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

interface Dashboard {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  monthlyRevenue: number;
  totalPaymentsThisMonth: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`p-2 rounded-md ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export const DashboardContent = () => {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await apiClient.getDashboard() as Dashboard;
        setDashboard(data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
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
      name: 'Total Miembros',
      value: dashboard.totalMembers,
      icon: UsersIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Miembros Activos',
      value: dashboard.activeMembers,
      icon: UsersIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Ingresos del Mes',
      value: formatCurrency(dashboard.monthlyRevenue),
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500'
    },
    {
      name: 'Pagos del Mes',
      value: dashboard.totalPaymentsThisMonth,
      icon: CalendarIcon,
      color: 'bg-purple-500'
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
                <ChartBarIcon className="h-5 w-5 text-blue-400" />
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
