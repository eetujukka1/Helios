import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/context/theme-provider.tsx"
import { showServerErrorToast } from "@/lib/server-error-toast"

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: showServerErrorToast,
  }),
  mutationCache: new MutationCache({
    onError: showServerErrorToast,
  }),
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
