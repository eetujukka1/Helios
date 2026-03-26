import { createContext, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { login as authLogin } from "@/services/auth-service"

interface AuthContextType {
  token: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("helios-token"))
  const navigate = useNavigate()

  const login = async (username: string, password: string) => {
    const token = await authLogin(username, password)
    localStorage.setItem("helios-token", token)
    setToken(token)
    navigate("/dashboard")
  }

  const logout = () => {
    localStorage.removeItem("helios-token")
    setToken(null)
    navigate("/login")
  }

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>
}
/* eslint-disable react-refresh/only-export-components */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
