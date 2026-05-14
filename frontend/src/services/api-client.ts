import axios from "axios"
import { localStorageService } from "@/services/local-storage-service"

const apiClient = axios.create({ baseURL: "/api" })

apiClient.interceptors.request.use((config) => {
  const token = localStorageService.getItem("helios-token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default apiClient
