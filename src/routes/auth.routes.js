import { Router } from "express";
import { validateSignUp, validateSignIn } from "../middlewares/auth.middlewares.js";
import { signUp, signIn } from "../controllers/auth.controllers.js";

const authRouter = Router();

authRouter.post("/signup", validateSignUp, signUp);
authRouter.post("/signin", validateSignIn, signIn);

export default authRouter;