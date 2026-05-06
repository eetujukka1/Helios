import { z } from "zod";

export const TargetCreateSchema = z.object({
  domain: z.url(),
  disabled: z.boolean().optional(),
});

export const TargetSchema = TargetCreateSchema.extend({
  id: z.number(),
  disabled: z.boolean(),
});

export type Target = z.infer<typeof TargetSchema>;
export type TargetCreate = z.infer<typeof TargetCreateSchema>;
