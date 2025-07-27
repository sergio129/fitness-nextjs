'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AuthWrapper } from '@/components/AuthWrapper';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useMembers } from '@/hooks/useMembers';
import { Member } from '@/types';
import MemberForm from '@/components/MemberForm';
import MemberDetail from '@/components/MemberDetail';

// Componente Layout específico para Members
function MembersLayout({ children }: { readonly children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar para móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
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
