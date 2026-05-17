import type { ReactNode } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"

export function HoverCardWrapper({ children }: { children: ReactNode }) {
  return (
    <HoverCard openDelay={10} closeDelay={10}>
      {children}
    </HoverCard>
  )
}

export function HoverCardContentWrapper({ children }: { children: ReactNode }) {
  return (
    <HoverCardContent side="top" className="w-full">
      {children}
    </HoverCardContent>
  )
}

export function HoverCardTriggerWrapper({ children }: { children: ReactNode }) {
  return <HoverCardTrigger asChild>{children}</HoverCardTrigger>
}
