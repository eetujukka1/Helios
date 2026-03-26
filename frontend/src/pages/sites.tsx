import Protected from "@/layouts/protected"
import AppHeader from "@/components/app-header"
import SiteTable from "@/components/site-table"

import { Button } from "@/components/ui/button"
import { useSites } from "@/hooks/use-sites"
import { AddSiteModal } from "@/modals/add-site"

export default function Sites() {
  const { sites, loading, error, getSites } = useSites()
  return (
    <Protected>
      <AppHeader title="Sites">
        <Button onClick={getSites} variant="outline">
          Refresh
        </Button>
        <AddSiteModal />
      </AppHeader>
      <SiteTable sites={sites} loading={loading} error={error}/>
    </Protected>
  )
}
