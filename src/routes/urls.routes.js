import { Router } from "express";
import { validateToken, validateId, validateShortLink } from "../middlewares/url.middlewares.js";
import { shorten, getShorten, goShorten } from "../controllers/url.controllers.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateToken, shorten);
urlRouter.get("/urls/:id", validateId, getShorten);
urlRouter.get("/urls/open/:shortUrl", validateShortLink, goShorten);

export default urlRouter;