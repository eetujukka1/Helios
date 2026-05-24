import { Toaster } from "./components/ui/sonner"
import type { ComponentType, ReactElement } from "react"
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import { SECTIONS } from "@/config/nav/sections.ts"
import { Login } from "@/pages/login"
import { AuthProvider } from "@/context/auth-provider"
import "@/i18n"

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {(
            function routesFromSections(
              sections: Record<string, unknown>
            ): ReactElement[] {
              return Object.values(sections).flatMap((item) => {
                if (typeof item !== "object" || item === null) {
                  return []
                }

                const { path, component: Component, ...children } = item as {
                  path?: string
                  component?: ComponentType
                } & Record<string, unknown>

                const childRoutes: ReactElement[] = routesFromSections(
                  Object.fromEntries(
                    Object.entries(children).filter(
                      ([key, value]) =>
                        key !== "titleKey" &&
                        typeof value === "object" &&
                        value !== null
                    )
                  )
                )

                return path && Component
                  ? [
                      <Route key={path} path={path} element={<Component />} />,
                      ...childRoutes,
                    ]
                  : childRoutes
              })
            }
          )(SECTIONS)}
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <Navigate to={SECTIONS.platform.scrape.dashboard.path} replace />
            }
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
