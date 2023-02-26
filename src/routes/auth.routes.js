import { Router } from "express";
import { validateSignUp, validateSignIn } from "../middlewares/auth.middlewares.js";
import { signUp, signIn, getMe, getRanking } from "../controllers/auth.controllers.js";
import { validateToken } from "../middlewares/url.middlewares.js";

const authRouter = Router();

authRouter.post("/signup", validateSignUp, signUp);
authRouter.post("/signin", validateSignIn, signIn);
authRouter.get("/users/me", validateToken, getMe);
authRouter.get("/ranking", getRanking);

export default authRouter;