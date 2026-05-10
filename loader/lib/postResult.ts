import axios from "axios";
import getBaseUrl from "./getBaseUrl.js";
import getToken from "./getToken.js";
import { PageCreate } from "@helios/shared";

async function postNextPages(
  pages: PageCreate[],
  targetId: number,
): Promise<void> {
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

export default postNextPages;
