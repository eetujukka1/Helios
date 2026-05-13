import axios from "axios";
import getBaseUrl from "../lib/getBaseUrl.js";
import getToken from "../lib/getToken.js";
import { PageCreate } from "@helios/shared";

async function add(pages: PageCreate[], targetId: number): Promise<void> {
  await axios.post(
    `${getBaseUrl()}/api/targets/${targetId}/pages`,
    { pages },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );
}

export default add;
