"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { MagnifyingGlassIcon, CurrencyDollarIcon, PlusIcon } from '@heroicons/react/24/outline';
import { usePayments } from "@/hooks/usePayments"
import { useMembers } from "@/hooks/useMembers"
import { Payment, Member } from "@/types"
import { AuthWrapper } from "@/components/AuthWrapper"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import PaymentModal from '@/components/PaymentModal';

// Layout con navegación completa como el repositorio original
function PaymentsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
                <a href="/payments" className="bg-gray-100 text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <svg className="text-gray-500 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <a href="/payments" className="bg-gray-100 text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <svg className="text-gray-500 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <button className="text-xs font-medium text-gray-500 group-hover:text-gray-700">Cerrar Sesión</button>
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

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { getPayments } = usePayments();
  const { members: allMembers, loading: membersLoading, fetchMembers } = useMembers();

  const loadPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getPayments({
        page: currentPage,
        limit: 20
      });
      // Manejar tanto array simple como respuesta paginada
      if (Array.isArray(response)) {
        setPayments(response);
        setTotalPages(1);
      } else {
        const responseData = response as any;
        setPayments(responseData.data || responseData.payments || []);
        setTotalPages(Math.ceil((responseData.pagination?.total || responseData.total || 0) / (responseData.pagination?.limit || 20)));
      }
    } catch (error) {
      console.error('Error cargando pagos:', error);
      toast.error('Error al cargar los pagos');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]); // Remover getPayments para evitar bucle infinito

  useEffect(() => {
    loadPayments();
    // fetchMembers(); // Comentado: useMembers() ya hace fetch automáticamente
  }, []); // Eliminar dependencias para evitar bucle infinito

  const handleNewPayment = (member: Member) => {
    setSelectedMember(member);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedMember(null);
    loadPayments();
    fetchMembers(); // Recargar para actualizar fechas de pago
  };

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
        return 'Inscripción';
      case 'PENALTY':
        return 'Multa';
      case 'OTHER':
        return 'Otro';
      default:
        return type;
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      payment.member?.firstName?.toLowerCase().includes(searchLower) ||
      payment.member?.lastName?.toLowerCase().includes(searchLower) ||
      payment.member?.document?.toLowerCase().includes(searchLower) ||
      payment.description?.toLowerCase().includes(searchLower)
    );
  });

  const filteredMembers = allMembers.filter((member: Member) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      member.firstName.toLowerCase().includes(searchLower) ||
      member.lastName.toLowerCase().includes(searchLower) ||
      member.document.toLowerCase().includes(searchLower) ||
      member.email?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading || membersLoading) {
    return (
      <AuthWrapper>
        <ProtectedRoute>
          <PaymentsLayout>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          </PaymentsLayout>
        </ProtectedRoute>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <ProtectedRoute>
        <PaymentsLayout>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h1>
                <p className="text-gray-600">Administra los pagos de afiliados del gimnasio</p>
              </div>
            </div>

            {/* Nota sobre pagos electrónicos */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-blue-800">
                  <strong>Nota:</strong> Los pagos electrónicos no están implementados aún. 
                  Actualmente solo se soportan pagos manuales registrados desde la plataforma.
                </p>
              </div>
            </div>

            {/* Buscador */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, documento o descripción..."
                    className="input pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Tabla de afiliados para hacer pagos */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Buscar Afiliado para Registrar Pago</h3>
                {filteredMembers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No se encontraron afiliados</p>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Afiliado
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Documento
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Membresía
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cuota
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Último Pago
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Próximo Pago
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredMembers.map((member) => {
                            const isOverdue = member.nextPaymentDate && new Date(member.nextPaymentDate) < new Date();
                            const isDueSoon = member.nextPaymentDate && 
                              new Date(member.nextPaymentDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                            
                            return (
                              <tr key={member.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {member.firstName} {member.lastName}
                                    </p>
                                    {member.email && (
                                      <p className="text-sm text-gray-500">{member.email}</p>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {member.document}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    member.membershipType === 'MONTHLY' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    {member.membershipType === 'MONTHLY' ? 'Mensual' : 'Anual'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {formatCurrency(Number(member.monthlyFee))}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {member.lastPaymentDate 
                                    ? new Date(member.lastPaymentDate).toLocaleDateString('es-CO')
                                    : 'Sin pagos'
                                  }
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  {member.nextPaymentDate ? (
                                    <span className={`${
                                      isOverdue ? 'text-red-600 font-semibold' :
                                      isDueSoon ? 'text-yellow-600 font-semibold' :
                                      'text-gray-900'
                                    }`}>
                                      {new Date(member.nextPaymentDate).toLocaleDateString('es-CO')}
                                    </span>
                                  ) : '-'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    member.isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {member.isActive ? 'Activo' : 'Inactivo'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => handleNewPayment(member)}
                                    className="btn btn-sm btn-primary"
                                    title="Registrar pago"
                                  >
                                    <PlusIcon className="h-4 w-4 mr-1" />
                                    Pago
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Historial de Pagos */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Historial de Pagos Recientes</h3>
              </div>
              
              {filteredPayments.length === 0 ? (
                <div className="text-center py-8">
                  <CurrencyDollarIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No hay pagos registrados</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Afiliado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Monto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Descripción
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(payment.paymentDate).toLocaleDateString('es-CO')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-medium text-gray-900">
                                {payment.member?.firstName} {payment.member?.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {payment.member?.document}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {getPaymentTypeName(payment.paymentType)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(Number(payment.amount))}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {payment.description || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Página {currentPage} de {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="btn btn-sm btn-outline"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="btn btn-sm btn-outline"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal de Pago */}
            {showPaymentModal && selectedMember && (
              <PaymentModal
                member={selectedMember}
                onSuccess={handlePaymentSuccess}
                onClose={() => {
                  setShowPaymentModal(false);
                  setSelectedMember(null);
                }}
              />
            )}
          </div>
        </PaymentsLayout>
      </ProtectedRoute>
    </AuthWrapper>
  );
};

export default Payments;
