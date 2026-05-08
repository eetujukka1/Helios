import { useState } from "react"
import { revalidateLogic, useForm } from "@tanstack/react-form"
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
import { useTargets } from "@/hooks/use-targets"
import { TargetCreateSchema, type TargetCreate } from "@helios/shared"

type Props = {
  buttonText?: string
}

export function AddTargetModal({ buttonText }: Props) {
  const [open, setOpen] = useState(false)
  const { addTargets } = useTargets()
  const form = useForm({
    defaultValues: {
      domain: "",
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: TargetCreateSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      const target: TargetCreate = TargetCreateSchema.parse(value)
      await addTargets([target])
      formApi.reset()
      setOpen(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{buttonText || "Add"}</Button>
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
            <DialogTitle>Add targets</DialogTitle>
            <DialogDescription>
              Add target information here. Click Add to add.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <form.Field name="domain">
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label htmlFor={field.name}>URL</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="https://example.com"
                    value={field.state.value}
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
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
