import { z } from "zod";

export const PageCreateSchema = z.object({
  url: z.string(),
});

export const PageSchema = PageCreateSchema.extend({
  id: z.number(),
  targetId: z.number(),
});

export type Page = z.infer<typeof PageSchema>;
export type PageCreate = z.infer<typeof PageCreateSchema>;
