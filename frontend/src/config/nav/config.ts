import Dashboard from "@/pages/dashboard"
import Proxies from "@/pages/proxies"
import Targets from "@/pages/targets"
import type { PageItem, SectionTitleKey, NavTopLevelNode } from "./types"

export const SECTIONS = [
  {
    titleKey: "nav.group.platform",
    pages: [
      { titleKey: "nav.dashboard", path: "/dashboard", component: Dashboard },
      { titleKey: "nav.proxies", path: "/proxies", component: Proxies },
      { titleKey: "nav.targets", path: "/targets", component: Targets },
    ]
  }
] satisfies ReadonlyArray<{
  titleKey: SectionTitleKey,
  pages: PageItem[]
}>

export const SECTIONSv2 = {
  platform: {
    titleKey: "nav.group.platform",
    path: "/platform",
    children: {
      scrape: {
        titleKey: "nav.section.scrape",
        path: "/scrape",
        children: {
          dashboard: {
            titleKey: "nav.page.dashboard",
            path: "/dashboard",
            component: Dashboard
          },
          proxies: {
            titleKey: "nav.page.proxies",
            path: "/proxies",
            component: Proxies
          },
          targets: {
            titleKey: "nav.page.targets",
            path: "/targets",
            component: Targets
          }
        }
      }
    }
  }
} as const satisfies Record<string, NavTopLevelNode>