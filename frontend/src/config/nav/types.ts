export type PageTitleKey =
  | "nav.page.dashboard"
  | "nav.page.proxies"
  | "nav.page.targets"

export type GroupTitleKey = "nav.group.platform"

export type SectionTitleKey = "nav.section.scrape"

export type NavItem = {
  titleKey: PageTitleKey | SectionTitleKey | GroupTitleKey
  path?: string
  component?: () => React.JSX.Element
  children?: Record<string, NavItem>
}