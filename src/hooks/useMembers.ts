"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/utils/api"
import { Member, PaginationResponse } from "@/types"

export function useMembers(params?: any) {
  const [data, setData] = useState<PaginationResponse<Member> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiClient.getMembers(params)
      setData(response)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [params])

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
    members: data?.members || [],
    pagination: data?.pagination,
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
