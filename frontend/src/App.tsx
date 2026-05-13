import { Toaster } from "./components/ui/sonner"
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import { PAGES } from "@/config"
import { Login } from "@/pages/login"
import { AuthProvider } from "@/context/auth-provider"
import "@/i18n"

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          // Maps pages from config. Also used in the sidebar.
          {PAGES.map(({ path, component: Component }) => (
            <Route path={`${path}`} element={<Component />} />
          ))}
          // Login page
          <Route path="/login" element={<Login />} />
          // Catches all other paths
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
