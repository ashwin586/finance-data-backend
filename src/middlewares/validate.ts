import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/interface";
import { ZodError, ZodType } from "zod";
import AppError from "../utils/AppError";

const validate = (schema: ZodType) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errorMessages = (result.error as ZodError).issues
        .map((e) => e.message)
        .join(", ");
      throw new AppError(errorMessages, 400);
    }

    req.body = result.data;
    next();
  };
};

export default validate;
