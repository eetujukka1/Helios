import Dashboard from "@/pages/dashboard"
import Proxies from "@/pages/proxies"
import Targets from "@/pages/targets"

type PageTitleKey = "nav.dashboard" | "nav.proxies" | "nav.targets"

export const PAGES = [
  { titleKey: "nav.dashboard", path: "/dashboard", component: Dashboard },
  { titleKey: "nav.proxies", path: "/proxies", component: Proxies },
  { titleKey: "nav.targets", path: "/targets", component: Targets },
] satisfies ReadonlyArray<{
  titleKey: PageTitleKey
  path: string
  component: () => React.JSX.Element
}>
