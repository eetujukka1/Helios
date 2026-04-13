import { z } from "zod";

export const ProxyCreateSchema = z.object({
  host: z.string().min(1),
  port: z.number(),
  username: z.string().min(1).optional(),
  password: z.string().min(1).optional(),
  disabled: z.boolean().optional(),
});

export const ProxySchema = ProxyCreateSchema.extend({
  id: z.number(),
  disabled: z.boolean(),
});

export type Proxy = z.infer<typeof ProxySchema>;
export type ProxyCreate = z.infer<typeof ProxyCreateSchema>;

export const ProxyUpdateSchema = ProxyCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one field must be provided for update." },
);

export type ProxyUpdate = z.infer<typeof ProxyUpdateSchema>;

export const TargetCreateSchema = z.object({
  domain: z.string().min(1),
  disabled: z.boolean().optional(),
});

export const TargetSchema = TargetCreateSchema.extend({
  id: z.number(),
  disabled: z.boolean(),
});

export type Target = z.infer<typeof TargetSchema>;
export type TargetCreate = z.infer<typeof TargetCreateSchema>;
