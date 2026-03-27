export type Proxy = {
  id: string | number
  host: string
  port: number
  username: string
  password?: string
  disabled: boolean
}

export type Site = {
  id: number,
  domain: string,
  disabled: boolean
}