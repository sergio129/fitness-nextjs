"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { apiClient } from "@/utils/api"
import { Member } from "@/types"

export function useMembers(params?: any) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoizar los parámetros para evitar re-renders innecesarios
  const memoizedParams = useMemo(() => {
    return params ? JSON.stringify(params) : null
  }, [params])

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true)
      const parsedParams = memoizedParams ? JSON.parse(memoizedParams) : undefined
      const response = await apiClient.getMembers(parsedParams)
      // Manejar tanto respuesta paginada como array simple
      const membersData = Array.isArray(response) ? response : ((response as any)?.members || [])
      setMembers(membersData)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [memoizedParams])

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
