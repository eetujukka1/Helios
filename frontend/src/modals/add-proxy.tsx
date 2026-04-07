import { useState } from "react"
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
import { useProxies } from "@/hooks/use-proxies"

type Props = {
  buttonText?: string
}

export function AddProxyModal({ buttonText }: Props) {
  const [open, setOpen] = useState(false)
  const { addProxies } = useProxies()

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    await addProxies([
      {
        host: data.get("host") as string,
        port: Number(data.get("port")),
        username: data.get("username") as string,
        password: data.get("password") as string,
      },
    ])
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
            <DialogTitle>Add proxies</DialogTitle>
            <DialogDescription>
              Add proxy information here. Click Add to add.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="host">Host</Label>
              <Input id="host" name="host" placeholder="1.1.1.1" required />
            </Field>
            <Field>
              <Label htmlFor="port">Port</Label>
              <Input id="port" name="port" placeholder="522" required />
            </Field>
            <Field>
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="user" />
            </Field>
            <Field>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="password"
                type="password"
              />
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
