export type Proxy = {
  id: string | number
  host: string
  port: number
  username?: string
  password?: string
  disabled: boolean
}

export type ProxyInput = Omit<Proxy, "id" | "disabled">

export type Site = {
  id: number
  domain: string
  disabled: boolean
}

export type SiteInput = Omit<Site, "id" | "disabled">
