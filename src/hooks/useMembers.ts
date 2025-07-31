"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/utils/api"
import { Member } from "@/types"

export function useMembers(params?: any) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiClient.getMembers(params)
      // Manejar tanto respuesta paginada como array simple
      const membersData = Array.isArray(response) ? response : ((response as any)?.members || [])
      setMembers(membersData)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, []) // Eliminar params de las dependencias para evitar bucle infinito

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const createMember = async (memberData: any) => {
    try {
      await apiClient.createMember(memberData)
      await fetchMembers()
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  const updateMember = async (id: string, memberData: any) => {
    try {
      await apiClient.updateMember(id, memberData)
      await fetchMembers()
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  const deleteMember = async (id: string) => {
    try {
      await apiClient.deleteMember(id)
      await fetchMembers()
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  const toggleMemberStatus = async (id: string) => {
    try {
      await apiClient.toggleMemberStatus(id)
      await fetchMembers()
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  return {
    members,
    loading,
    error,
    refetch: fetchMembers,
    fetchMembers,
    createMember,
    updateMember,
    deleteMember,
    toggleMemberStatus
  }
}
