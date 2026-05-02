import { z } from "zod";

// Proxy schemas

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
  disabled: z.boolean(),
});

export type Proxy = z.infer<typeof ProxySchema>;
export type ProxyCreate = z.infer<typeof ProxyCreateSchema>;

export const ProxyUpdateSchema = ProxyCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one field must be provided for update." },
);

export type ProxyUpdate = z.infer<typeof ProxyUpdateSchema>;

// Target schemas

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

// Page schemas

export const PageCreateSchema = z.object({
  url: z.string(),
});

export const PageSchema = PageCreateSchema.extend({
  id: z.number(),
  targetId: z.number(),
});

export type Page = z.infer<typeof PageSchema>;
export type PageCreate = z.infer<typeof PageCreateSchema>;

// File schemas

export const FileCreateSchema = z.object({
  name: z.string().min(1),
});

export const FileSchema = FileCreateSchema.extend({
  id: z.number(),
});

export type File = z.infer<typeof FileSchema>;
export type FileCreate = z.infer<typeof FileCreateSchema>;

// Response schemas

export const ResponseCreateSchema = z.object({
  fileId: z.number(),
  proxyId: z.number(),
  statusCode: z.number(),
});

export const ResponseSchema = ResponseCreateSchema.extend({
  id: z.number(),
  date: z.iso.datetime(),
});

export type Response = z.infer<typeof ResponseSchema>;
export type ResponseCreate = z.infer<typeof ResponseCreateSchema>;
