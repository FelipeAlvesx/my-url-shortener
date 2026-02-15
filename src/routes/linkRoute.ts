import Router from "express";
import { createLink } from "./links/create.ts";
import { redirectLink } from "./links/redirect.ts";
import { findAll } from "./links/findAll.ts";
import { jwtMiddleware } from "../middlewares/jwtMiddleware.ts";

export const linkRouter = Router();

linkRouter.post("/links", jwtMiddleware, createLink);

linkRouter.get("/:code", redirectLink);

linkRouter.get("/links/all", jwtMiddleware, findAll);
