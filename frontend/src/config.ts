import Dashboard from "@/pages/dashboard"
import Proxies from "@/pages/proxies"
import Targets from "@/pages/targets"

type SectionTitleKey = "nav.group.platform"
type PageTitleKey = "nav.dashboard" | "nav.proxies" | "nav.targets"

type PageItem = {
  titleKey: PageTitleKey
  path: string
  component: () => React.JSX.Element
}

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
