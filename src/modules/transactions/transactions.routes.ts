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

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1000
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *                 example: EXPENSE
 *               category:
 *                 type: string
 *                 example: SALARY
 *               date:
 *                 type: string
 *                 example: "2026-04-02"
 *               notes:
 *                 type: string
 *                 example: Payroll payment
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: de942a75-8100-4e26-8b96-269a83de8fe6
 *                     amount:
 *                       type: string
 *                       example: "1000"
 *                     type:
 *                       type: string
 *                       example: EXPENSE
 *                     category:
 *                       type: string
 *                       example: SALARY
 *                     date:
 *                       type: string
 *                       example: 2026-04-02T00:00:00.000Z
 *                     notes:
 *                       type: string
 *                       example: Payroll payment
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                     userId:
 *                       type: string
 *                       example: 444e692a-9503-4c6f-beb8-ff0fa46d229d
 *                     createdAt:
 *                       type: string
 *                       example: 2026-04-05T07:06:51.663Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2026-04-05T07:06:51.663Z
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Amount must be a positive number
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: You do not have permission to perform this action
 */
transactionRoutes.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createTransactionSchema),
  createTransactionController,
);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions with filters, search and pagination
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *         description: Filter by transaction type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         description: Filter from date e.g. 2026-01-01
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         description: Filter to date e.g. 2026-12-31
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by category or notes
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transactions fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 3da1e4b5-3c3d-4b9f-8c41-5fba7a1e002f
 *                       amount:
 *                         type: string
 *                         example: "100"
 *                       type:
 *                         type: string
 *                         example: EXPENSE
 *                       category:
 *                         type: string
 *                         example: SALARY
 *                       date:
 *                         type: string
 *                         example: 2026-04-02T00:00:00.000Z
 *                       notes:
 *                         type: string
 *                         example: Payroll payment
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       userId:
 *                         type: string
 *                         example: 444e692a-9503-4c6f-beb8-ff0fa46d229d
 *                       createdAt:
 *                         type: string
 *                         example: 2026-04-03T08:18:54.216Z
 *                       updatedAt:
 *                         type: string
 *                         example: 2026-04-03T08:18:54.216Z
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 2
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: No token provided or token expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: No token provided
 */
transactionRoutes.get(
  "/",
  authenticate,
  authorize("ADMIN", "VIEWER", "ANALYST"),
  getTransactionsController,
);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: dd5938e7-620f-4a2c-b963-657edfa587f0
 *                     amount:
 *                       type: string
 *                       example: "1000"
 *                     type:
 *                       type: string
 *                       example: EXPENSE
 *                     category:
 *                       type: string
 *                       example: SALARY
 *                     date:
 *                       type: string
 *                       example: 2026-04-02T00:00:00.000Z
 *                     notes:
 *                       type: string
 *                       example: Payroll payment
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                     userId:
 *                       type: string
 *                       example: 444e692a-9503-4c6f-beb8-ff0fa46d229d
 *                     createdAt:
 *                       type: string
 *                       example: 2026-04-03T08:20:09.501Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2026-04-03T08:20:09.501Z
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Transaction not found
 */
transactionRoutes.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "ANALYST", "VIEWER"),
  getTransactionByIdController,
);

/**
 * @swagger
 * /api/transactions/{id}:
 *   patch:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 6000
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *                 example: EXPENSE
 *               category:
 *                 type: string
 *                 example: Marketing
 *               date:
 *                 type: string
 *                 example: "2024-02-01"
 *               notes:
 *                 type: string
 *                 example: Updated notes
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: dd5938e7-620f-4a2c-b963-657edfa587f0
 *                     amount:
 *                       type: string
 *                       example: "6000"
 *                     type:
 *                       type: string
 *                       example: EXPENSE
 *                     category:
 *                       type: string
 *                       example: marketing
 *                     date:
 *                       type: string
 *                       example: 2024-02-01T00:00:00.000Z
 *                     notes:
 *                       type: string
 *                       example: Updated notes
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                     userId:
 *                       type: string
 *                       example: 444e692a-9503-4c6f-beb8-ff0fa46d229d
 *                     createdAt:
 *                       type: string
 *                       example: 2026-04-03T08:20:09.501Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2026-04-05T07:10:09.071Z
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Amount must be a positive number
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Transaction not found
 */
transactionRoutes.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(updateTransactionSchema),
  updateTransactionController,
);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Soft delete a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Transaction not found
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: You do not have permission to perform this action
 */
transactionRoutes.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteTransactionController,
);

export default transactionRoutes;
