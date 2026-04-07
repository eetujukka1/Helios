import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { describe, it, expect, vi, beforeEach } from "vitest"
import TargetTable from "@/components/target-table"
import * as targetService from "@/services/target-service"

vi.mock("@/services/target-service", () => ({
  get: vi.fn(),
  add: vi.fn(),
  remove: vi.fn(),
}))

const mockGet = vi.mocked(targetService.get)
const mockRemove = vi.mocked(targetService.remove)

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      {children}
    </QueryClientProvider>
  )
}

const testTarget = {
  id: 1,
  domain: "example.com",
  disabled: false,
}

describe("TargetTable", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows a loading spinner while fetching", () => {
    mockGet.mockReturnValue(new Promise(() => {}))
    render(<TargetTable />, { wrapper })
    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("shows empty state when there are no targets", async () => {
    mockGet.mockResolvedValue([])
    render(<TargetTable />, { wrapper })
    expect(await screen.findByText("No targets")).toBeInTheDocument()
  })

  it("shows target data in the table", async () => {
    mockGet.mockResolvedValue([testTarget])
    render(<TargetTable />, { wrapper })
    expect(await screen.findByText("example.com")).toBeInTheDocument()
    expect(screen.getByText("Enabled")).toBeInTheDocument()
  })

  it("shows disabled badge for disabled targets", async () => {
    mockGet.mockResolvedValue([{ ...testTarget, disabled: true }])
    render(<TargetTable />, { wrapper })
    expect(await screen.findByText("Disabled")).toBeInTheDocument()
  })

  it("shows error message when fetch fails", async () => {
    mockGet.mockRejectedValue(new Error("Network error"))
    render(<TargetTable />, { wrapper })
    expect(await screen.findByText("Network error")).toBeInTheDocument()
  })

  it("opens remove confirmation dialog when trash button is clicked", async () => {
    mockGet.mockResolvedValue([testTarget])
    const user = userEvent.setup()
    render(<TargetTable />, { wrapper })
    await screen.findByText("example.com")

    await user.click(screen.getByRole("button"))

    expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument()
    expect(
      screen.getByText(/You are about to remove example\.com/)
    ).toBeInTheDocument()
  })

  it("calls remove service on confirm", async () => {
    mockGet.mockResolvedValue([testTarget])
    mockRemove.mockResolvedValue({ ...testTarget })
    const user = userEvent.setup()
    render(<TargetTable />, { wrapper })
    await screen.findByText("example.com")

    await user.click(screen.getByRole("button"))
    await user.click(screen.getByRole("button", { name: "Remove" }))

    expect(mockRemove).toHaveBeenCalledWith(1)
  })
})
