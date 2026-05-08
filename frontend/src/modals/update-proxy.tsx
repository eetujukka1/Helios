import { useState } from "react"
import { revalidateLogic, useForm } from "@tanstack/react-form"
import type { z } from "zod"
import { ProxyCreateSchema, type Proxy, type ProxyCreate } from "@helios/shared"
import { PencilIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useProxies } from "@/hooks/use-proxies"

import { useTranslation } from 'react-i18next';

type Props = {
  proxy: Proxy
}

type UpdateProxyFormValues = Omit<z.input<typeof ProxyCreateSchema>, "port"> & {
  port: number | undefined
}

export function UpdateProxyModal({ proxy }: Props) {
  const [open, setOpen] = useState(false)
  const { updateProxy } = useProxies()
  const { t } = useTranslation();

  const defaultValues: UpdateProxyFormValues = {
    host: proxy.host,
    port: proxy.port,
    username: proxy.username ?? "",
    password: "",
  }
  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ProxyCreateSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      const updatedProxy: ProxyCreate = ProxyCreateSchema.parse(value)
      await updateProxy({
        id: proxy.id,
        proxy: updatedProxy,
      })
      formApi.reset()
      setOpen(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="xs" variant="outline" aria-label={`Edit ${proxy.host}`}>
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
          className="grid gap-4"
        >
          <DialogHeader>
            <DialogTitle>{t("proxies.dialogs.update.title")}</DialogTitle>
            <DialogDescription>
              {t("proxies.dialogs.update.description")}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <form.Field name="host">
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label htmlFor={`host-${proxy.id}`}>{t("proxies.fields.host.label")}</Label>
                  <Input
                    id={`host-${proxy.id}`}
                    name={field.name}
                    value={field.state.value}
                    aria-invalid={field.state.meta.errors.length > 0}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
            <form.Field name="port">
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label htmlFor={`port-${proxy.id}`}>{t("proxies.fields.port.label")}</Label>
                  <Input
                    id={`port-${proxy.id}`}
                    name={field.name}
                    type="number"
                    value={field.state.value ?? ""}
                    aria-invalid={field.state.meta.errors.length > 0}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        Number.isNaN(e.target.valueAsNumber)
                          ? undefined
                          : e.target.valueAsNumber
                      )
                    }
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
            <form.Field name="username">
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label htmlFor={`username-${proxy.id}`}>{t("proxies.fields.username.label")}</Label>
                  <Input
                    id={`username-${proxy.id}`}
                    name={field.name}
                    placeholder={t("proxies.fields.username.placeholder")}
                    value={field.state.value ?? ""}
                    aria-invalid={field.state.meta.errors.length > 0}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
            <form.Field name="password">
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label htmlFor={`password-${proxy.id}`}>{t("proxies.fields.password.label")}</Label>
                  <Input
                    id={`password-${proxy.id}`}
                    name={field.name}
                    placeholder={t("proxies.fields.password.keepCurrentHint")}
                    type="password"
                    value={field.state.value ?? ""}
                    aria-invalid={field.state.meta.errors.length > 0}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("common.actions.cancel")}</Button>
            </DialogClose>
            <Button type="submit">{t("common.actions.update")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
