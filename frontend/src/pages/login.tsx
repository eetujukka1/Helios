import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-provider"

import { useTranslation } from "react-i18next"

export function Login({ className, ...props }: React.ComponentProps<"div">) {
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value
    try {
      await login(username, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"))
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle>{t("auth.login.title")}</CardTitle>
              <CardDescription>{t("auth.login.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="username">
                      {t("auth.login.fields.username.label")}
                    </FieldLabel>
                    <Input
                      id="username"
                      type="username"
                      placeholder={t("auth.login.fields.username.placeholder")}
                      required
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">
                        {t("auth.login.fields.password.label")}
                      </FieldLabel>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      placeholder={t("auth.login.fields.password.placeholder")}
                    />
                  </Field>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Field>
                    <Button type="submit">{t("auth.login.submit")}</Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
