import { AuthRequest } from "../../types/interface";
import { Response } from "express";
import { TransactionType } from "@prisma/client";
import AppError from "../../utils/AppError";
import z from "zod";
import {
  createTransactionService,
  getTransactionsService,
  getTransactionByIdService,
  updateTransactionService,
  deleteTransactionService,
} from "./transactions.service";

export const createTransactionController = async (
  req: AuthRequest,
  res: Response,
) => {
  const { amount, type, category, date, notes } = req.body;
  const { id } = req.user as { id: string };

  const result = await createTransactionService(
    id,
    amount,
    type,
    category,
    date,
    notes,
  );

  return res
    .status(201)
    .json({ message: "Transaction created successfully", data: result });
};

export const getTransactionsController = async (
  req: AuthRequest,
  res: Response,
) => {
  const { type, category, from, to, search, page, limit } = req.query as {
    type?: string;
    category?: string;
    from?: string;
    to?: string;
    search?: string;
    page?: string;
    limit?: string;
  };

  const pageNumber = parseInt(page ?? "1");
  const limitNumber = parseInt(limit ?? "10");

  const result = await getTransactionsService(
    type,
    category,
    from,
    to,
    search,
    pageNumber,
    limitNumber,
  );
  res.status(200).json({
    message: "Transactions fetched successfully",
    data: result.transactions,
    meta: {
      total: result.total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(result.total / limitNumber),
    },
  });
};

export const getTransactionByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  const { id } = req.params as { id: string };
  const result = await getTransactionByIdService(id);
  return res
    .status(200)
    .json({ message: "Transaction fetched successfully", data: result });
};

export const updateTransactionController = async (
  req: AuthRequest,
  res: Response,
) => {
  const { amount, type, category, date, notes } = req.body;
  const { id } = req.params as { id: string };

  const result = await updateTransactionService(
    id,
    amount,
    type,
    category,
    date,
    notes,
  );

  return res
    .status(200)
    .json({ message: "Transaction updated successfully", data: result });
};

export const deleteTransactionController = async (
  req: AuthRequest,
  res: Response,
) => {
  const { id } = req.params as { id: string };

  await deleteTransactionService(id);
  return res.status(200).json({ message: "Transaction deleted successfully" });
};
