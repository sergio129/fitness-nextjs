"use client"

import { AuthProvider } from "@/contexts/AuthContext"

interface ClientProviderProps {
  children: React.ReactNode
}

export function ClientProvider({ children }: ClientProviderProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
