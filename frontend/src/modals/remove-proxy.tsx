import { useState } from "react"
import { useProxies } from "@/hooks/use-proxies"

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

import type { Proxy } from "@helios/shared"
import { Trash2Icon } from "lucide-react"

import { useTranslation } from "react-i18next"

type Props = {
  proxy: Proxy
}

export function RemoveProxyModal({ proxy }: Props) {
  const [open, setOpen] = useState(false)
  const { removeProxy } = useProxies()
  const { t } = useTranslation()

  const handleOnClick = async () => {
    await removeProxy(proxy.id)
    setOpen(false)
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="xs"
          variant="destructive"
          aria-label={`Remove ${proxy.host}`}
        >
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("proxies.dialogs.remove.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("proxies.dialogs.remove.description", { host: proxy.host })}
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
