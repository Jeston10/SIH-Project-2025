"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { loginRequest } from "@/lib/api"

type AuthContextType = {
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    if (t) setToken(t)
  }, [])

  const value = useMemo<AuthContextType>(() => ({
    token,
    isAuthenticated: Boolean(token),
    async login(email, password) {
      try {
        const data = await loginRequest(email, password)
        const t = data?.data?.token || data?.token
        if (t) {
          localStorage.setItem("auth_token", t)
          setToken(t)
          return true
        }
        return false
      } catch {
        return false
      }
    },
    logout() {
      localStorage.removeItem("auth_token")
      setToken(null)
    },
  }), [token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}


