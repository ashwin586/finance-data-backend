import { Request, Response } from "express";
import { registerService, loginService } from "./auth.service";

export async function registerController(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const result = await registerService(name, email, password);

  res.status(201).json({
    message: "User registered successfully",
    data: result,
  });
}

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;

  const result = await loginService(email, password);

  res.status(200).json({
    message: "Logged in successfully",
    data: result,
  });
}
