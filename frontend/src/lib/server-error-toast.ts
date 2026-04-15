import { isAxiosError } from "axios"
import { toast } from "sonner"

const DEFAULT_ERROR_MESSAGE = "Something went wrong while contacting the server"

/**
 * Converts unknown query/mutation failures into a user-facing message.
 *
 * Rationale:
 * 1) Prefer backend-provided messages when available (`response.data` or
 *    `response.data.error`) so users see the most actionable error.
 * 2) Fall back to the client/runtime error message for transport failures.
 * 3) Use a stable default string as a final fallback to avoid blank toasts.
 *
 * React Query gives `unknown` in global `onError` callbacks, so this helper
 * narrows types safely and keeps message extraction behavior centralized.
 */
function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const payload = error.response?.data

    if (typeof payload === "string" && payload.trim()) {
      return payload
    }

    if (
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      typeof payload.error === "string" &&
      payload.error.trim()
    ) {
      return payload.error
    }

    if (error.message.trim()) {
      return error.message
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return DEFAULT_ERROR_MESSAGE
}

export function showServerErrorToast(error: unknown): void {
  toast.error("Request failed", {
    description: getErrorMessage(error),
    position: "top-center",
  })
}
