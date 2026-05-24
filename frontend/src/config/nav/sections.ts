import Dashboard from "@/pages/dashboard.tsx"
import Proxies from "@/pages/proxies.tsx"
import Targets from "@/pages/targets.tsx"
import { mapSections } from "@/config/nav/utils.ts"
import type { NavItem } from "@/config/nav/types.ts"

const rawSections = {
  platform: {
    titleKey: "nav.group.platform",
    children: {
      scrape: {
        titleKey: "nav.section.scrape",
        path: "/scrape",
        children: {
          dashboard: {
            titleKey: "nav.page.dashboard",
            path: "/dashboard",
            component: Dashboard,
          },
          proxies: {
            titleKey: "nav.page.proxies",
            path: "/proxies",
            component: Proxies,
          },
          targets: {
            titleKey: "nav.page.targets",
            path: "/targets",
            component: Targets,
          },
        },
      },
    },
  },
} satisfies Record<string, NavItem>

export const SECTIONS = mapSections({ sections: rawSections })