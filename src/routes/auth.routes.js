import { Router } from "express";
import { validateSignUp } from "../middlewares/auth.middlewares.js";
import { signUp } from "../controllers/auth.controllers.js";

const authRouter = Router();

authRouter.post("/signup", validateSignUp, signUp);

export default authRouter;