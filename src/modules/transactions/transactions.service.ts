import { TransactionType } from "@prisma/client";
import prisma from "../../config/db";
import AppError from "../../utils/AppError";

export const createTransactionService = async (
  userId: string,
  amount: number,
  type: TransactionType,
  category: string,
  date: Date,
  notes: string,
) => {
  const newTransaction = await prisma.transaction.create({
    data: {
      userId,
      amount,
      type,
      category,
      date: new Date(date),
      notes,
    },
  });

  return newTransaction;
};

export const getTransactionsService = async (
  type?: string,
  category?: string,
  from?: string,
  to?: string,
  search?: string,
  page: number = 1,
  limit: number = 10,
) => {
  const where = {
    isDeleted: false,
    type: type ? (type as TransactionType) : undefined,
    category: category ? category.toLowerCase() : undefined,
    date: {
      gte: from ? new Date(from) : undefined,
      lte: to ? new Date(to) : undefined,
    },
    ...(search && {
      OR: [
        { category: { contains: search, mode: "insensitive" as const } },
        { notes: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [transactions, total] = await prisma.$transaction([
    prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return { transactions, total };
};

export const getTransactionByIdService = async (id: string) => {
  const transaction = await prisma.transaction.findUnique({ where: { id } });
  if (!transaction || transaction.isDeleted) {
    throw new AppError("Transaction not found", 404);
  }
  return transaction;
};

export const updateTransactionService = async (
  id: string,
  amount: number,
  type: TransactionType,
  category: string,
  date: Date,
  notes: string,
) => {
  const transaction = await prisma.transaction.findUnique({ where: { id } });

  if (!transaction || transaction.isDeleted) {
    throw new AppError("Transaction not found", 404);
  }

  const updatedTransaction = await prisma.transaction.update({
    where: { id },
    data: {
      id,
      amount,
      type,
      category,
      date: new Date(date),
      notes,
    },
  });

  return updatedTransaction;
};

export const deleteTransactionService = async (id: string) => {
  const transaction = await prisma.transaction.findUnique({ where: { id } });

  if (!transaction || transaction.isDeleted) {
    throw new AppError("Transaction not found", 404);
  }

  const updatedTransaction = await prisma.transaction.update({
    where: { id },
    data: { isDeleted: true },
  });

  return updatedTransaction;
};
