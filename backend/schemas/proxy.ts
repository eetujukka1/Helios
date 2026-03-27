import * as z from "zod";

export const ProxySchema = z.object({
  id: z.union([z.number(), z.undefined()]),
  host: z.string(),
  port: z.number(),
  username: z.string(),
  password: z.optional(z.string()),
  enabled: z.optional(z.boolean()),
});

export type Proxy = z.infer<typeof ProxySchema>;
