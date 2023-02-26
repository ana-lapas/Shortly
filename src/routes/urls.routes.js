import { Router } from "express";
import { validateToken, validateId } from "../middlewares/url.middlewares.js";
import { shorten, getShorten } from "../controllers/url.controllers.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateToken, shorten);
urlRouter.get("/urls/:id", validateId, getShorten);

export default urlRouter;