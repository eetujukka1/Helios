import { PageCreate } from "@helios/shared";
import apiClient from "./api-client.js";

async function add(pages: PageCreate[], targetId: number): Promise<void> {
  await apiClient.post(`/targets/${targetId}/pages`, { pages });
}

export default add;
