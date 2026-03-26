import { Separator } from "@/components/ui/separator"

export default function AppHeader({ title, children }: { title: string, children?: React.ReactNode }) {
  return (
    <>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {title}
      </h2>
      <div className="flex flex-row gap-2">
        {children}
      </div>
      <Separator />
    </>
  )
}
