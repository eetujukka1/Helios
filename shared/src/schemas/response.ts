import { z } from "zod";

export const ResponseCreateSchema = z.object({
  fileId: z.number().optional(),
  proxyId: z.number().optional(),
  statusCode: z.number(),
});

export const ResponseSchema = ResponseCreateSchema.extend({
  id: z.number(),
  date: z.iso.datetime(),
});

export type Response = z.infer<typeof ResponseSchema>;
export type ResponseCreate = z.infer<typeof ResponseCreateSchema>;
