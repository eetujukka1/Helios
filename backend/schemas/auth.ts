import { z } from "zod";

export enum ActorTypeEnum {
  User = "user",
  Worker = "worker",
}

export const ActorTypeSchema = z.enum([
  ActorTypeEnum.User,
  ActorTypeEnum.Worker,
]);
export type ActorType = z.infer<typeof ActorTypeSchema>;

export const UserAuthClaimsSchema = z.object({
  actorType: z.literal(ActorTypeEnum.User),
  username: z.string().min(1),
});

export const WorkerAuthClaimsSchema = z.object({
  actorType: z.literal(ActorTypeEnum.Worker),
  workerId: z.string().min(1),
});

export const AuthClaimsSchema = z.discriminatedUnion("actorType", [
  UserAuthClaimsSchema,
  WorkerAuthClaimsSchema,
]);

export type AuthClaims = z.infer<typeof AuthClaimsSchema>;
