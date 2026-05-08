import axios from "axios"
import i18n from "@/i18n"
import apiClient from "./api-client"

export async function login(
  username: string,
  password: string
): Promise<string> {
  try {
    const { data } = await apiClient.post("/auth/login", { username, password })
    return data.token
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401)
      throw new Error(i18n.t("errors.invalidCredentials"))
    throw new Error(i18n.t("errors.generic"))
  }
}
