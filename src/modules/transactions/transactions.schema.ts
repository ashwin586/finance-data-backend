import { z } from "zod";
import { TransactionType } from "@prisma/client";

export const createTransactionSchema = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  type: z.enum(TransactionType, { message: "Invalid transaction type" }),
  category: z.string().min(1, "Category is required"),
  date: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && val.length >= 8;
    },
    {
      message:
        "Invalid date, please provide a valid date format like 2026-01-01",
    },
  ),
  notes: z.string().optional(),
});

export const updateTransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive number").optional(),
  type: z
    .enum(TransactionType, { message: "Invalid transaction type" })
    .optional(),
  category: z.string().min(1, "Category cannot be empty").optional(),
  date: z
    .string()
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && val.length >= 8;
      },
      {
        message:
          "Invalid date, please provide a valid date format like 2026-01-01",
      },
    )
    .optional(),
  notes: z.string().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

