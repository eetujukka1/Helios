import { z } from "zod";

export const FileCreateSchema = z.object({
  name: z.string().min(1),
});

export const FileSchema = FileCreateSchema.extend({
  id: z.number(),
});

export type File = z.infer<typeof FileSchema>;
export type FileCreate = z.infer<typeof FileCreateSchema>;
