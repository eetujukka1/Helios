import { Navigate } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/context/auth-provider"

export default function Protected({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-w-0 flex-1">
        <SidebarTrigger />
        <div className="p-8 flex w-full flex-col gap-4">{children}</div>
      </main>
    </SidebarProvider>
  )
}
