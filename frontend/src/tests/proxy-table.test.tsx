import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { describe, it, expect, vi, beforeEach } from "vitest"
import ProxyTable from "@/components/proxy-table"
import * as proxyService from "@/services/proxy-service"

vi.mock("@/services/proxy-service", () => ({
  get: vi.fn(),
  add: vi.fn(),
  remove: vi.fn(),
}))

const mockGet = vi.mocked(proxyService.get)
const mockRemove = vi.mocked(proxyService.remove)

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

const testProxy = {
  id: 1,
  host: "1.1.1.1",
  port: 8080,
  username: "user",
  disabled: false,
}

describe("ProxyTable", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows a loading spinner while fetching", () => {
    mockGet.mockReturnValue(new Promise(() => {}))
    render(<ProxyTable />, { wrapper })
    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("shows empty state when there are no proxies", async () => {
    mockGet.mockResolvedValue([])
    render(<ProxyTable />, { wrapper })
    expect(await screen.findByText("No proxies")).toBeInTheDocument()
  })

  it("shows proxy data in the table", async () => {
    mockGet.mockResolvedValue([testProxy])
    render(<ProxyTable />, { wrapper })
    expect(await screen.findByText("1.1.1.1")).toBeInTheDocument()
    expect(screen.getByText("8080")).toBeInTheDocument()
    expect(screen.getByText("user")).toBeInTheDocument()
    expect(screen.getByText("Enabled")).toBeInTheDocument()
  })

  it("shows disabled badge for disabled proxies", async () => {
    mockGet.mockResolvedValue([{ ...testProxy, disabled: true }])
    render(<ProxyTable />, { wrapper })
    expect(await screen.findByText("Disabled")).toBeInTheDocument()
  })

  it("shows error message when fetch fails", async () => {
    mockGet.mockRejectedValue(new Error("Network error"))
    render(<ProxyTable />, { wrapper })
    expect(await screen.findByText("Network error")).toBeInTheDocument()
  })

  it("opens remove confirmation dialog when trash button is clicked", async () => {
    mockGet.mockResolvedValue([testProxy])
    const user = userEvent.setup()
    render(<ProxyTable />, { wrapper })
    await screen.findByText("1.1.1.1")

    await user.click(screen.getByRole("button"))

    expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument()
    expect(
      screen.getByText(/You are about to remove 1\.1\.1\.1/)
    ).toBeInTheDocument()
  })

  it("calls remove service on confirm", async () => {
    mockGet.mockResolvedValue([testProxy])
    mockRemove.mockResolvedValue([])
    const user = userEvent.setup()
    render(<ProxyTable />, { wrapper })
    await screen.findByText("1.1.1.1")

    await user.click(screen.getByRole("button"))
    await user.click(screen.getByRole("button", { name: "Remove" }))

    expect(mockRemove).toHaveBeenCalledWith(1)
  })
})
