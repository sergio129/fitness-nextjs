import Link from "next/link";
'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AuthWrapper } from '@/components/AuthWrapper';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useMembers } from '@/hooks/useMembers';
import { Member } from '@/types';
import MemberForm from '@/components/MemberForm';
import { useAuth } from '@/contexts/AuthContext';
import MemberDetail from '@/components/MemberDetail';

// Layout con navegación completa como el repositorio original
function MembersLayout({ children }: { readonly children: React.ReactNode }) {
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
<Link href="/users" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
  <svg className="text-gray-400 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A4 4 0 017 17h10a4 4 0 01.879.804M7 7a4 4 0 018 0M7 7v2a4 4 0 008 0V7" />
  </svg>
  Usuarios
</Link>
                <a href="/members" className="bg-gray-100 text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <svg className="text-gray-500 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <h1 className="text-xl font-bold text-gray-900">🏋️ GYMControl</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              <a href="/dashboard" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <svg className="text-gray-400 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                Dashboard
              </a>
              <a href="/users" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <svg className="text-gray-400 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A4 4 0 017 17h10a4 4 0 01.879.804M7 7a4 4 0 018 0M7 7v2a4 4 0 008 0V7" />
                </svg>
                Usuarios
              </a>
              <a href="/members" className="bg-gray-100 text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <svg className="text-gray-500 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

function Members() {
  const { members, loading, fetchMembers, deleteMember, toggleMemberStatus } = useMembers();
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const handleCreateMember = () => {
    setSelectedMember(null);
    setShowForm(true);
  };

  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setShowForm(true);
  };

  const handleViewMember = (member: Member) => {
    setSelectedMember(member);
    setShowDetail(true);
  };

  const handleDeleteMember = async (member: Member) => {
    if (window.confirm(`¿Estás seguro de eliminar al afiliado ${member.firstName} ${member.lastName}?`)) {
      try {
        await deleteMember(member.id);
        toast.success('Afiliado eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando afiliado:', error);
        toast.error('Error al eliminar el afiliado');
      }
    }
  };

  const handleToggleStatus = async (member: Member) => {
    try {
      await toggleMemberStatus(member.id);
      toast.success(`Afiliado ${member.isActive ? 'desactivado' : 'activado'} exitosamente`);
    } catch (error) {
      console.error('Error cambiando estado del afiliado:', error);
      toast.error('Error al cambiar el estado del afiliado');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedMember(null);
    fetchMembers();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredMembers = members.filter((member: Member) => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && member.isActive) ||
      (statusFilter === 'inactive' && !member.isActive);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <MembersLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </MembersLayout>
    );
  }

  return (
    <MembersLayout>
      <div className="space-y-6">
        {/* Título y botón de agregar */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Afiliados</h1>
            <p className="text-gray-600">Gestión de miembros del gimnasio</p>
          </div>
          <button
            onClick={handleCreateMember}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo Afiliado
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                id="search"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Buscar por nombre, documento o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                id="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de afiliados */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Lista de Afiliados ({filteredMembers.length})
            </h3>
          </div>

          {filteredMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron afiliados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
                <thead>
                  <tr>
                    <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                    <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membresía</th>
                    <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuota</th>
                    <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Registro</th>
                    <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member: Member) => (
                    <tr key={member.id} className="border-b border-gray-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <p className="font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.document}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.phone || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.membershipType === 'MONTHLY' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {member.membershipType === 'MONTHLY' ? 'Mensual' : 'Anual'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(member.monthlyFee)}
                        <span className="text-xs text-gray-500 block">
                          / {member.membershipType === 'MONTHLY' ? 'mes' : 'año'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {member.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(member.registrationDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewMember(member)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-2 rounded text-sm transition-colors"
                            title="Ver detalles"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditMember(member)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-2 rounded text-sm transition-colors"
                            title="Editar"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(member)}
                            className={`font-medium py-1 px-2 rounded text-sm transition-colors ${member.isActive ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                            title={member.isActive ? 'Desactivar' : 'Activar'}
                          >
                            {member.isActive ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member)}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-2 rounded text-sm transition-colors"
                            title="Eliminar"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      {showForm && (
        <MemberForm
          member={selectedMember}
          onSuccess={handleFormSuccess}
          onClose={() => {
            setShowForm(false);
            setSelectedMember(null);
          }}
        />
      )}

      {showDetail && selectedMember && (
        <MemberDetail
          member={selectedMember}
          onClose={() => {
            setShowDetail(false);
            setSelectedMember(null);
          }}
          onEdit={() => {
            setShowDetail(false);
            handleEditMember(selectedMember);
          }}
        />
      )}
    </MembersLayout>
  );
}

export default function MembersPage() {
  return (
    <AuthWrapper>
      <ProtectedRoute>
        <Members />
      </ProtectedRoute>
    </AuthWrapper>
  );
}
