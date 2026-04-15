import { useState } from "react"
import type { Proxy } from "@helios/shared"
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
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useProxies } from "@/hooks/use-proxies"

type Props = {
  proxy: Proxy
}

export function UpdateProxyModal({ proxy }: Props) {
  const [open, setOpen] = useState(false)
  const { updateProxy } = useProxies()

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    await updateProxy({
      id: proxy.id,
      proxy: {
        host: data.get("host") as string,
        port: Number(data.get("port")),
        username: (data.get("username") as string) || undefined,
        password: (data.get("password") as string) || undefined,
      },
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="xs" variant="outline" aria-label={`Edit ${proxy.host}`}>
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Update proxy</DialogTitle>
            <DialogDescription>
              Update proxy information here. Click Update to save changes.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor={`host-${proxy.id}`}>Host</Label>
              <Input
                id={`host-${proxy.id}`}
                name="host"
                defaultValue={proxy.host}
                required
              />
            </Field>
            <Field>
              <Label htmlFor={`port-${proxy.id}`}>Port</Label>
              <Input
                id={`port-${proxy.id}`}
                name="port"
                defaultValue={proxy.port}
                required
              />
            </Field>
            <Field>
              <Label htmlFor={`username-${proxy.id}`}>Username</Label>
              <Input
                id={`username-${proxy.id}`}
                name="username"
                defaultValue={proxy.username ?? ""}
              />
            </Field>
            <Field>
              <Label htmlFor={`password-${proxy.id}`}>Password</Label>
              <Input
                id={`password-${proxy.id}`}
                name="password"
                placeholder="Leave blank to keep current password"
                type="password"
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
