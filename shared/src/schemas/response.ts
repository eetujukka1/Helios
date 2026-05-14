import { z } from "zod";

export const ResponseCreateSchema = z.object({
  fileId: z.coerce.number().int().positive().optional(),
  proxyId: z.coerce.number().int().positive().optional(),
  statusCode: z.coerce.number().int(),
});

export const ResponseSchema = ResponseCreateSchema.extend({
  id: z.number(),
  date: z.iso.datetime(),
});

export type Response = z.infer<typeof ResponseSchema>;
export type ResponseCreate = z.infer<typeof ResponseCreateSchema>;
