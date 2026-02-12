import Router from "express";
import { createLink } from "./links/create.ts";
import { redirectLink } from "./links/redirect.ts";

export const linkRouter = Router();

linkRouter.post("/links", createLink);

linkRouter.get("/:code", redirectLink);
