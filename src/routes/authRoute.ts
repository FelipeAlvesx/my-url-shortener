import { Router } from "express";
import { register } from "./auth/register.ts";
import { login } from "./auth/login.ts";

export const authRouter = Router();

authRouter.post("/register", register);

authRouter.post("/login", login);
