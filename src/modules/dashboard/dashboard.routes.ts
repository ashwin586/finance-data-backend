import { Router } from "express";
import {
  getSummaryController,
  getByCategoryController,
  getRecentActivityController,
  getTrendsController,
} from "./dashboard.controller";
import authenticate from "../../middlewares/authenticate";
import authorize from "../../middlewares/authorize";

const dashboardRoutes = Router();

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get total income, expenses and net balance
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dashboard summary fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalIncome:
 *                       type: number
 *                       example: 100000
 *                     totalExpenses:
 *                       type: number
 *                       example: 1100
 *                     netBalance:
 *                       type: number
 *                       example: 98900
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
dashboardRoutes.get(
  "/summary",
  authenticate,
  authorize("ADMIN", "ANALYST"),
  getSummaryController,
);

/**
 * @swagger
 * /api/dashboard/by-category:
 *   get:
 *     summary: Get transaction totals grouped by category
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard category summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dashboard category summary fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         example: Revenue
 *                       total:
 *                         type: number
 *                         example: 100000
 */
dashboardRoutes.get(
  "/by-category",
  authenticate,
  authorize("ADMIN", "ANALYST"),
  getByCategoryController,
);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get last 10 transactions
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent dashboard activity fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Recent dashboard activity fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: de942a75-8100-4e26-8b96-269a83de8fe6
 *                       amount:
 *                         type: string
 *                         example: "1000"
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
 *                       createdAt:
 *                         type: string
 *                         example: 2026-04-05T07:06:51.663Z
 */
dashboardRoutes.get(
  "/recent",
  authenticate,
  authorize("ADMIN", "ANALYST"),
  getRecentActivityController,
);

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     summary: Get monthly income vs expense trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trend dashboard fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Trend dashboard fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "2026-01"
 *                       totalIncome:
 *                         type: number
 *                         example: 100000
 *                       totalExpenses:
 *                         type: number
 *                         example: 0
 */
dashboardRoutes.get(
  "/trends",
  authenticate,
  authorize("ADMIN", "ANALYST"),
  getTrendsController,
);

export default dashboardRoutes;
