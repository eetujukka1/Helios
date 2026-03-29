import Protected from "@/layouts/protected"
import AppHeader from "@/components/app-header"

export default function Dashboard() {
  return (
    <Protected>
      <AppHeader title="Dashboard"></AppHeader>
    </Protected>
  )
}
