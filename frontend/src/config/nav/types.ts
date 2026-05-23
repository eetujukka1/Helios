export type SectionTitleKey = "nav.group.platform"

export type PageTitleKey = "nav.dashboard" | "nav.proxies" | "nav.targets"

export type GroupTitleKey = ""



export type SectionTitleKeyv2 = "nav.section.scrape"

export type PageTitleKeyv2 = "nav.page.dashboard" | "nav.page.proxies" | "nav.page.targets"

export type GroupTitleKeyv2 = "nav.group.platform"

export type PageItem = {
  titleKey: PageTitleKey
  path: string
  component: () => React.JSX.Element
}

export type NavChildren = Record<string, NavNode>

export type NavNode = {
  titleKey: PageTitleKeyv2 | SectionTitleKeyv2
  path: string
  component?: () => React.JSX.Element
  children?: NavChildren
}

export type NavTopLevelNode = {
  titleKey: GroupTitleKeyv2
  path: string
  children: NavChildren
}