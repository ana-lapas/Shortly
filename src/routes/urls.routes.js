import { Router } from "express";
import { validateToken } from "../middlewares/url.middlewares.js";
import { shorten } from "../controllers/url.controllers.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateToken, shorten);

export default urlRouter;