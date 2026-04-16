import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AuthClaims, ActorTypeEnum } from "../schemas/auth.js";

export const login = (req: Request, res: Response): void => {
  const { username, password } = req.body;
  if (
    username === process.env.DEMO_USER_USERNAME &&
    password === process.env.DEMO_USER_PASSWORD
  ) {
    const claims: AuthClaims = {
      actorType: ActorTypeEnum.User,
      username,
    };
    const token = jwt.sign(claims, process.env.JWT_SECRET as string);
    res.json({ token });
    return;
  }
  res.status(401).json({ message: "Invalid credentials" });
};
