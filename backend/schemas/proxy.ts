import * as z from "zod";

export const ProxySchema = z.object({
  id: z.union([z.number(), z.undefined()]),
  host: z.string().min(1),
  port: z.number(),
  username: z.optional(z.string()),
  password: z.optional(z.string()),
  disabled: z.optional(z.boolean()),
});

export type Proxy = z.infer<typeof ProxySchema>;
