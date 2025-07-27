"use client"

import { AuthProvider } from "@/contexts/AuthContext"

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
