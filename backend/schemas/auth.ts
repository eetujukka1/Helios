import { z } from "zod";

export const UserAuthClaimsSchema = z.object({
  actorType: z.literal("user"),
  username: z.string().min(1),
});

export const WorkerAuthClaimsSchema = z.object({
  actorType: z.literal("worker"),
  workerId: z.string().min(1),
});

export const AuthClaimsSchema = z.discriminatedUnion("actorType", [
  UserAuthClaimsSchema,
  WorkerAuthClaimsSchema,
]);

export type AuthClaims = z.infer<typeof AuthClaimsSchema>;
