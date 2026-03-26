import axios from "axios"

export async function login(username: string, password: string): Promise<string> {
  try {
    const { data } = await axios.post("http://localhost:3000/api/auth/login", { username, password });
    return data.token;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) throw new Error("Invalid credentials");
    throw new Error("Something went wrong");
  }
}
