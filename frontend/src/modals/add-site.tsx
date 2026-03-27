import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addSites as add } from "@/services/site-service"

type Props = {
  buttonText?: string
}

export function AddSiteModal({ buttonText }: Props) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: add,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sites"] }),
  })

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    await mutateAsync([{
      domain: data.get("domain") as string,
    }])
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{buttonText || "Add"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Add sites</DialogTitle>
            <DialogDescription>
              Add site information here. Click Add to add.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="domain">Domain</Label>
              <Input id="domain" name="domain" placeholder="example.com" />
            </Field>
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
