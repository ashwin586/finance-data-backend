import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  console.error("Unexpected error:", err);
  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};

export default errorHandler;
