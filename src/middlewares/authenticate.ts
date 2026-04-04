import { Response, NextFunction } from "express";
import jwt, {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";
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

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };

    req.user = {
      id: decoded.id,
      role: decoded.role as any,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AppError("Session has expired, please login again", 401);
    }
    if (error instanceof JsonWebTokenError) {
      throw new AppError("Invalid token", 401);
    }
    throw new AppError("Authentication failed", 401);
  }
};

export default authenticate;
