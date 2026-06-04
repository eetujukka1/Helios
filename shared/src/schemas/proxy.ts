import { z } from "zod";

export const ProxyCreateSchema = z.object({
  host: z.string().min(1),
  port: z.number(),
  username: z
    .string()
    .min(1)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  password: z
    .string()
    .min(1)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  disabled: z.boolean().optional(),
});

export const ProxySchema = ProxyCreateSchema.extend({
  id: z.number(),
  username: z.string().min(1).nullable().optional(),
  password: z.string().min(1).nullable().optional(),
  disabled: z.boolean(),
});

export const ProxyResponseSchema = ProxySchema.omit({ password: true });

export type Proxy = z.infer<typeof ProxySchema>;
export type ProxyResponse = z.infer<typeof ProxyResponseSchema>;
export type ProxyCreate = z.infer<typeof ProxyCreateSchema>;

export const ProxyUpdateSchema = ProxyCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one field must be provided for update." },
);

export type ProxyUpdate = z.infer<typeof ProxyUpdateSchema>;
