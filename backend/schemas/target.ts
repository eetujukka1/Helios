import * as z from "zod";

export const TargetSchema = z.object({
  id: z.union([z.number(), z.undefined()]),
  domain: z.string(),
  disabled: z.optional(z.boolean()),
});

export type Target = z.infer<typeof TargetSchema>;
