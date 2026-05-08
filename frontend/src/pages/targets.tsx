import Protected from "@/layouts/protected"
import AppHeader from "@/components/app-header"
import TargetTable from "@/components/target-table"

import { Button } from "@/components/ui/button"
import { useTargets } from "@/hooks/use-targets"
import { AddTargetModal } from "@/modals/add-target"

import { useTranslation } from 'react-i18next';

export default function Targets() {
  const { getTargets } = useTargets()
  const { t } = useTranslation();

  return (
    <Protected>
      <AppHeader title={t("targets.page.title")}>
        <Button onClick={getTargets} variant="outline">
          {t("common.actions.refresh")}
        </Button>
        <AddTargetModal />
      </AppHeader>
      <TargetTable />
    </Protected>
  )
}
