import { Router } from "express";
import {
  createTransactionController,
  getTransactionsController,
  getTransactionByIdController,
  updateTransactionController,
  deleteTransactionController,
} from "./transactions.controller";
import authenticate from "../../middlewares/authenticate";
import authorize from "../../middlewares/authorize";
import validate from "../../middlewares/validate";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "./transactions.schema";

const transactionRoutes = Router();

transactionRoutes.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createTransactionSchema),
  createTransactionController,
);
transactionRoutes.get(
  "/",
  authenticate,
  authorize("ADMIN", "VIEWER", "ANALYST"),
  getTransactionsController,
);
transactionRoutes.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "ANALYST", "VIEWER"),
  getTransactionByIdController,
);
transactionRoutes.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(updateTransactionSchema),
  updateTransactionController,
);
transactionRoutes.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteTransactionController,
);

export default transactionRoutes;
