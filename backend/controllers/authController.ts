import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AuthClaims, ActorTypeEnum } from "../schemas/auth.js";
import { envService } from "../services/envService.js";

export const login = (req: Request, res: Response): void => {
  const { username, password } = req.body;
  if (
    username === envService.get("DEMO_USER_USERNAME") &&
    password === envService.get("DEMO_USER_PASSWORD")
  ) {
    const claims: AuthClaims = {
      actorType: ActorTypeEnum.User,
      username,
    };
    const token = jwt.sign(claims, envService.getRequired("JWT_SECRET"));
    res.json({ token });
    return;
  }
  res.status(401).json({ message: "Invalid credentials" });
};
