import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Globe, LogOut, Moon, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "./ui/button"
import { useTheme } from "../context/theme-provider"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

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
  SidebarMenuAction,
  SidebarContent,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import {
  HoverCardWrapper,
  HoverCardContentWrapper,
  HoverCardTriggerWrapper,
} from "@/components/reusables/hover-card"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu.tsx"

import { SECTIONS } from "@/config/nav/sections.ts"
import type { NavItem } from "@/config/nav/types.ts"
import { useAuth } from "@/context/auth-provider"
import { supportedLanguages, type AppLanguage } from "@/i18n"

const languageOptionKeys = {
  en: "common.language.options.en",
  fi: "common.language.options.fi",
} as const satisfies Record<AppLanguage, string>

type SidebarNavItem = {
  titleKey: NavItem["titleKey"]
  path?: string
  component?: unknown
} & Record<string, unknown>

const navItemKeys = new Set(["titleKey", "path", "component"])

function isSidebarNavItem(item: unknown): item is SidebarNavItem {
  return typeof item === "object" && item !== null && "titleKey" in item
}

function getChildNavItems(item: SidebarNavItem): SidebarNavItem[] {
  return Object.values(
    Object.fromEntries(
      Object.entries(item).filter(
        ([key, value]) => !navItemKeys.has(key) && isSidebarNavItem(value)
      )
    ) as Record<string, SidebarNavItem>
  )
}

function getLeafNavItems(items: SidebarNavItem[]): SidebarNavItem[] {
  return items.flatMap((item) => {
    const children = getChildNavItems(item)

    return children.length > 0 ? getLeafNavItems(children) : item
  })
}

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
          {Object.values(SECTIONS).map((group) => (
            <div key={group.titleKey}>
              <SidebarGroupLabel>{t(group.titleKey)}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {getChildNavItems(group).map((section) => {
                    const children = getChildNavItems(section)
                    const childPages = getLeafNavItems(children).filter(
                      (item) => item.path
                    )
                    const hasSectionRoute = Boolean(
                      section.path && section.component
                    )
                    const isSectionActive =
                      childPages.some((item) => pathname === item.path) ||
                      pathname === section.path

                    return (
                      <Collapsible
                        key={section.titleKey}
                        asChild
                        defaultOpen={isSectionActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          {childPages.length > 0 ? (
                            <>
                              {hasSectionRoute ? (
                                <>
                                  <SidebarMenuButton
                                    asChild
                                    isActive={isSectionActive}
                                  >
                                    <Link to={section.path ?? "/"}>
                                      <span>{t(section.titleKey)}</span>
                                    </Link>
                                  </SidebarMenuButton>
                                  <CollapsibleTrigger asChild>
                                    <SidebarMenuAction
                                      aria-label={`Toggle ${t(section.titleKey)}`}
                                    >
                                      <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuAction>
                                  </CollapsibleTrigger>
                                </>
                              ) : (
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuButton isActive={isSectionActive}>
                                    <span>{t(section.titleKey)}</span>
                                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                  </SidebarMenuButton>
                                </CollapsibleTrigger>
                              )}
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {childPages.map((item) => (
                                    <SidebarMenuSubItem key={item.path}>
                                      <SidebarMenuSubButton
                                        asChild
                                        isActive={pathname === item.path}
                                      >
                                        <Link to={item.path ?? "/"}>
                                          <span>{t(item.titleKey)}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  ))}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </>
                          ) : (
                            <SidebarMenuButton
                              asChild
                              isActive={pathname === section.path}
                            >
                              <Link to={section.path ?? "/"}>
                                {t(section.titleKey)}
                              </Link>
                            </SidebarMenuButton>
                          )}
                        </SidebarMenuItem>
                      </Collapsible>
                    )
                  })}
                </SidebarMenu>
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
