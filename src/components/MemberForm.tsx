'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { apiClient } from '@/utils/api';
import { Member } from '@/types';

interface MemberFormProps {
  member?: Member | null;
  onSuccess: () => void;
  onClose: () => void;
}

interface MemberFormData {
  firstName: string;
  lastName: string;
  document: string;
  email?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  registrationDate: string;
  membershipType: 'MONTHLY' | 'ANNUAL';
  monthlyFee: number;
  notes?: string;
}

const MemberForm: React.FC<MemberFormProps> = ({ member, onSuccess, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<MemberFormData>();

  useEffect(() => {
    if (member) {
      reset({
        firstName: member.firstName,
        lastName: member.lastName,
        document: member.document,
        email: member.email || '',
        phone: member.phone || '',
        address: member.address || '',
        birthDate: member.birthDate ? new Date(member.birthDate).toISOString().split('T')[0] : '',
        registrationDate: new Date(member.registrationDate).toISOString().split('T')[0],
        membershipType: member.membershipType,
        monthlyFee: Number(member.monthlyFee),
        notes: member.notes || ''
      });
    } else {
      // Valores por defecto para nuevo miembro
      reset({
        firstName: '',
        lastName: '',
        document: '',
        email: '',
        phone: '',
        address: '',
        birthDate: '',
        registrationDate: new Date().toISOString().split('T')[0],
        membershipType: 'MONTHLY',
        monthlyFee: 80000,
        notes: ''
      });
    }
  }, [member, reset]);

  const onSubmit = async (data: MemberFormData) => {
    try {
      setIsSubmitting(true);
      
      const memberData = {
        ...data,
        birthDate: data.birthDate || undefined,
        monthlyFee: Number(data.monthlyFee)
      };

      if (member) {
        await apiClient.updateMember(member.id, memberData);
        toast.success('Afiliado actualizado exitosamente');
      } else {
        await apiClient.createMember(memberData);
        toast.success('Afiliado creado exitosamente');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error guardando afiliado:', error);
      toast.error('Error al guardar el afiliado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {member ? 'Editar Afiliado' : 'Nuevo Afiliado'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombres *
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstName ? 'border-red-500' : ''}`}
                {...register('firstName', { required: 'Los nombres son requeridos' })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellidos *
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lastName ? 'border-red-500' : ''}`}
                {...register('lastName', { required: 'Los apellidos son requeridos' })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Documento *
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.document ? 'border-red-500' : ''}`}
                {...register('document', { required: 'El documento es requerido' })}
              />
              {errors.document && (
                <p className="text-red-500 text-sm mt-1">{errors.document.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : ''}`}
                {...register('email', {
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Email inválido'
                  }
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...register('phone')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...register('birthDate')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Ingreso *
              </label>
              <input
                type="date"
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.registrationDate ? 'border-red-500' : ''}`}
                {...register('registrationDate', { required: 'La fecha de ingreso es requerida' })}
              />
              {errors.registrationDate && (
                <p className="text-red-500 text-sm mt-1">{errors.registrationDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Membresía *
              </label>
              <select
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.membershipType ? 'border-red-500' : ''}`}
                {...register('membershipType', { required: 'El tipo de membresía es requerido' })}
              >
                <option value="MONTHLY">Mensual</option>
                <option value="ANNUAL">Anual</option>
              </select>
              {errors.membershipType && (
                <p className="text-red-500 text-sm mt-1">{errors.membershipType.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('address')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cuota Mensual (COP) *
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.monthlyFee ? 'border-red-500' : ''}`}
              {...register('monthlyFee', {
                required: 'La cuota mensual es requerida',
                min: { value: 0, message: 'La cuota debe ser mayor a 0' }
              })}
            />
            {errors.monthlyFee && (
              <p className="text-red-500 text-sm mt-1">{errors.monthlyFee.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('notes')}
              placeholder="Notas adicionales sobre el afiliado..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {(() => {
                if (isSubmitting) return 'Guardando...';
                return member ? 'Actualizar' : 'Crear';
              })()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;
