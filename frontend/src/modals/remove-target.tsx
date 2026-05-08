import { useState } from "react"
import { useTargets } from "@/hooks/use-targets"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"

import type { Target } from "@helios/shared"
import { Trash2Icon } from "lucide-react"

import { useTranslation } from 'react-i18next';

type Props = {
  target: Target
}

export function RemoveTargetModal({ target }: Props) {
  const [open, setOpen] = useState(false)
  const { removeTarget } = useTargets()
  const { t } = useTranslation();

  const handleOnClick = async () => {
    await removeTarget(target.id)
    setOpen(false)
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="xs" variant="destructive">
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("targets.dialogs.remove.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("targets.dialogs.remove.description", { domain: target.domain })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.actions.cancel")}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleOnClick}>
            {t("common.actions.remove")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
