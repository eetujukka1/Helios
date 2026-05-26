import type { NavItem } from "@/config/nav/types.ts"

type MapSectionsParams<TSections extends Record<string, NavItem>> = {
  sections: TSections
  path?: string
}

export type MapSectionsReturn<TSections extends Record<string, NavItem>> = {
  [TKey in keyof TSections]: Omit<TSections[TKey], "children" | "path"> & {
    path: string
  } & (TSections[TKey] extends { children: infer TChildren }
      ? TChildren extends Record<string, NavItem>
        ? MapSectionsReturn<TChildren>
        : Record<never, never>
      : Record<never, never>)
}

export function mapSections<TSections extends Record<string, NavItem>>({
  sections,
  path = "",
}: MapSectionsParams<TSections>): MapSectionsReturn<TSections> {
  return Object.fromEntries(
    Object.entries(sections).map(([key, value]) => {
      const currentPath = value.path ? `${path}${value.path}` : path
      const { children, ...item } = value

      return [
        key,
        {
          ...item,
          path: currentPath,
          ...(children
            ? mapSections({
                sections: children,
                path: currentPath,
              })
            : {}),
        },
      ]
    })
  ) as MapSectionsReturn<TSections>
}
