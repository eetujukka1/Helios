import { z } from "zod";

export const ResponseCreateSchema = z.object({
  fileId: z.number(),
  proxyId: z.number(),
  statusCode: z.number(),
});

export const ResponseSchema = ResponseCreateSchema.extend({
  id: z.number(),
  date: z.iso.datetime(),
});

export type Response = z.infer<typeof ResponseSchema>;
export type ResponseCreate = z.infer<typeof ResponseCreateSchema>;
