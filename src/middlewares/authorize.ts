import { NextFunction, Response } from "express";
import { Role } from "@prisma/client";
import { AuthRequest } from "../types/interface";
import AppError from "../utils/AppError";

const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) throw new AppError("Authentication required", 401);

    if (!roles.includes(user.role))
      throw new AppError(
        "You do not have permission to perform this action",
        403,
      );

    next();
  };
};

export default authorize;
