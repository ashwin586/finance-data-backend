import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import { AuthRequest } from "../types/interface";

const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("No token provided", 401);
  }

  const token = header?.split(" ")[1];

  if (!token) {
    throw new AppError("No token provided", 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
    id: string;
    role: string;
  };

  req.user = {
    id: decoded.id,
    role: decoded.role as any,
  };

  next();
};

export default authenticate;
