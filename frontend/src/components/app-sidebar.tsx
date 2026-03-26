import { Link, useLocation } from "react-router-dom"
import { Moon, Sun, LogOut } from "lucide-react"

import { Button } from "./ui/button"
import { useTheme } from "../context/theme-provider"

import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarContent,
} from "@/components/ui/sidebar"

import { PAGES } from "@/config"
import { useAuth } from "@/context/auth-provider"

export function AppSidebar() {
  const { pathname } = useLocation()
  const { logout } = useAuth()
  const { theme, setTheme } = useTheme()

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="scroll-m-20 py-4 text-center text-4xl font-bold tracking-tight text-balance">
          Helios
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PAGES.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === `${item.path}`}
                  >
                    <Link to={`${item.path}`}>{item.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              {isDark ? <Sun /> : <Moon />}
            </Button>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
