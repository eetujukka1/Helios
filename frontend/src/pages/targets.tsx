import Protected from "@/layouts/protected"
import AppHeader from "@/components/app-header"
import TargetTable from "@/components/target-table"

import { Button } from "@/components/ui/button"
import { useTargets } from "@/hooks/use-targets"
import { AddTargetModal } from "@/modals/add-target"

export default function Targets() {
  const { getTargets } = useTargets()
  return (
    <Protected>
      <AppHeader title="Targets">
        <Button onClick={getTargets} variant="outline">
          Refresh
        </Button>
        <AddTargetModal />
      </AppHeader>
      <TargetTable />
    </Protected>
  )
}
