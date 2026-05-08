import { useState } from "react"
import { revalidateLogic, useForm } from "@tanstack/react-form"
import type { z } from "zod"
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
import { ProxyCreateSchema, type ProxyCreate } from "@helios/shared"

import { useTranslation } from 'react-i18next';

type Props = {
  buttonText?: string
}

type AddProxyFormValues = Omit<z.input<typeof ProxyCreateSchema>, "port"> & {
  port: number | undefined
}

export function AddProxyModal({ buttonText }: Props) {
  const [open, setOpen] = useState(false)
  const { addProxies } = useProxies()
  const { t } = useTranslation();

  const defaultValues: AddProxyFormValues = {
    host: "",
    port: undefined,
    username: "",
    password: "",
  }

  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ProxyCreateSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      const proxy: ProxyCreate = ProxyCreateSchema.parse(value)
      await addProxies([proxy])
      formApi.reset()
      setOpen(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{buttonText || t("common.actions.add")}</Button>
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
            <DialogTitle>{t("proxies.dialogs.add.title")}</DialogTitle>
            <DialogDescription>
              {t("proxies.dialogs.add.description")}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <form.Field name="host">
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label htmlFor={field.name}>{t("proxies.fields.host.label")}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder={t("proxies.fields.host.placeholder")}
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
                  <Label htmlFor={field.name}>{t("proxies.fields.port.label")}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    placeholder={t("proxies.fields.port.placeholder")}
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
                  <Label htmlFor={field.name}>{t("proxies.fields.username.label")}</Label>
                  <Input
                    id={field.name}
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
                  <Label htmlFor={field.name}>{t("proxies.fields.password.label")}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder={t("proxies.fields.password.placeholder")}
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
            <Button type="submit">{t("common.actions.add")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
