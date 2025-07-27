"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/utils/api"
import { Payment, PaginationResponse } from "@/types"

export function usePayments(params?: any) {
  const [data, setData] = useState<PaginationResponse<Payment> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getPayments(params)
      setData(response)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [JSON.stringify(params)])

  const createPayment = async (paymentData: any) => {
    try {
      await apiClient.createPayment(paymentData)
      await fetchPayments()
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  const deletePayment = async (id: string) => {
    try {
      await apiClient.deletePayment(id)
      await fetchPayments()
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  return {
    payments: data?.payments || [],
    pagination: data?.pagination,
    loading,
    error,
    refetch: fetchPayments,
    createPayment,
    deletePayment
  }
}
