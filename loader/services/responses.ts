import { ResponseCreate } from "@helios/shared";
import apiClient from "./api-client.js";

const CONTENTS_FILE_NAME = "contents.html";

function appendResponseDetails(
  formData: FormData,
  response: ResponseCreate,
): void {
  formData.append("statusCode", response.statusCode.toString());

  if (typeof response.fileId === "number") {
    formData.append("fileId", response.fileId.toString());
  }

  if (typeof response.proxyId === "number") {
    formData.append("proxyId", response.proxyId.toString());
  }
}

async function addResponse(
  pageId: number,
  response: ResponseCreate,
  htmlContent: string,
): Promise<void> {
  const formData = new FormData();

  formData.append(
    CONTENTS_FILE_NAME,
    new Blob([htmlContent], { type: "text/html" }),
    CONTENTS_FILE_NAME,
  );
  appendResponseDetails(formData, response);

  await apiClient.post(`/pages/${pageId}/responses`, formData);
}

export default addResponse;
