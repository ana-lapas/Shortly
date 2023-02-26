import { Router } from "express";
import { validateToken, validateId, validateShortLink, validateIdAndUser } from "../middlewares/url.middlewares.js";
import { shorten, getShorten, goShorten, deleteShorten } from "../controllers/url.controllers.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateToken, shorten);
urlRouter.get("/urls/:id", validateId, getShorten);
urlRouter.get("/urls/open/:shortUrl", validateShortLink, goShorten);
urlRouter.delete("/urls/:id", validateToken, validateIdAndUser, deleteShorten);

export default urlRouter;