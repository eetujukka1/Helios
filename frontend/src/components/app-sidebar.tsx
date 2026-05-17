import { Link, useLocation } from "react-router-dom"
import { Globe, LogOut, Moon, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "./ui/button"
import { useTheme } from "../context/theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

import {
  HoverCardWrapper,
  HoverCardContentWrapper,
  HoverCardTriggerWrapper,
} from "@/components/reusables/hover-card"

import { SECTIONS } from "@/config"
import { useAuth } from "@/context/auth-provider"
import { supportedLanguages, type AppLanguage } from "@/i18n"

const languageOptionKeys = {
  en: "common.language.options.en",
  fi: "common.language.options.fi",
} as const satisfies Record<AppLanguage, string>

function normalizeLanguage(language?: string): AppLanguage {
  const normalizedLanguage = language?.split("-")[0]

  return supportedLanguages.includes(normalizedLanguage as AppLanguage)
    ? (normalizedLanguage as AppLanguage)
    : "en"
}

export function AppSidebar() {
  const { pathname } = useLocation()
  const { logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()

  const currentLanguage = normalizeLanguage(
    i18n.resolvedLanguage ?? i18n.language
  )

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="scroll-m-20 py-4 text-center text-4xl font-bold tracking-tight text-balance">
          {t("app.name")}
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {SECTIONS.map((item) => (
            <div key={item.titleKey}>
              <SidebarGroupLabel>{t(item.titleKey)}</SidebarGroupLabel>
              <SidebarGroupContent>
                {item.pages.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `${item.path}`}
                    >
                      <Link to={`${item.path}`}>{t(item.titleKey)}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarGroupContent>
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <HoverCardWrapper>
                <HoverCardTriggerWrapper>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("common.language.label")}
                    >
                      <Globe />
                    </Button>
                  </DropdownMenuTrigger>
                </HoverCardTriggerWrapper>
                <HoverCardContentWrapper>
                  <div>{t("common.actions.changeLanguage")}</div>
                </HoverCardContentWrapper>
              </HoverCardWrapper>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {t("common.language.label")}
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={currentLanguage}
                  onValueChange={(language) => {
                    void i18n.changeLanguage(language)
                  }}
                >
                  {supportedLanguages.map((language) => (
                    <DropdownMenuRadioItem key={language} value={language}>
                      {t(languageOptionKeys[language])}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <HoverCardWrapper>
              <HoverCardTriggerWrapper>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                >
                  {isDark ? <Sun /> : <Moon />}
                </Button>
              </HoverCardTriggerWrapper>
              <HoverCardContentWrapper>
                <div>{t("common.actions.toggleTheme")}</div>
              </HoverCardContentWrapper>
            </HoverCardWrapper>
            <HoverCardWrapper>
              <HoverCardTriggerWrapper>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut />
                </Button>
              </HoverCardTriggerWrapper>
              <HoverCardContentWrapper>
                <div>{t("common.actions.logout")}</div>
              </HoverCardContentWrapper>
            </HoverCardWrapper>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
