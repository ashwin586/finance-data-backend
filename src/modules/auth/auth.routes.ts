import { Router } from "express";
import { registerController, loginController } from "./auth.controller";
import validate from "../../middlewares/validate";
import { loginSchema, registerSchema } from "./auth.schema";

const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), registerController);
authRoutes.post("/login", validate(loginSchema), loginController);

export default authRoutes;
