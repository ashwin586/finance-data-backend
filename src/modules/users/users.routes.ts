import { Router } from "express";
import {
  getAllUsersController,
  getUserByIdController,
  updateUserRoleController,
  updateUserStatusController,
} from "./users.controller";
import authorize from "../../middlewares/authorize";
import authenticate from "../../middlewares/authenticate";

const userRoutes = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users with pagination and search
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
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
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fetched all users successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 07e7f748-69b8-4dba-945d-e5e747e34366
 *                       name:
 *                         type: string
 *                         example: Name
 *                       email:
 *                         type: string
 *                         example: email@gmail.com
 *                       role:
 *                         type: string
 *                         example: VIEWER
 *                       status:
 *                         type: string
 *                         example: ACTIVE
 *                       createdAt:
 *                         type: string
 *                         example: 2026-04-05T06:59:18.882Z
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
userRoutes.get("/", authenticate, authorize("ADMIN"), getAllUsersController);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 276dc2fc-ee3d-4c9a-b531-3ff8ea8127c5
 *                     name:
 *                       type: string
 *                       example: name
 *                     email:
 *                       type: string
 *                       example: email@gmail.com
 *                     role:
 *                       type: string
 *                       example: VIEWER
 *                     status:
 *                       type: string
 *                       example: ACTIVE
 *                     createdAt:
 *                       type: string
 *                       example: 2026-04-02T06:42:06.474Z
 *       404:
 *         description: User not found
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
 *                   example: User not found
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
userRoutes.get("/:id", authenticate, authorize("ADMIN"), getUserByIdController);

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Update user role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, ANALYST, VIEWER]
 *                 example: VIEWER
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User role updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 276dc2fc-ee3d-4c9a-b531-3ff8ea8127c5
 *                     name:
 *                       type: string
 *                       example: name
 *                     email:
 *                       type: string
 *                       example: email@gmail.com
 *                     role:
 *                       type: string
 *                       example: VIEWER
 *                     status:
 *                       type: string
 *                       example: ACTIVE
 *                     createdAt:
 *                       type: string
 *                       example: 2026-04-02T06:42:06.474Z
 *       400:
 *         description: Invalid role provided
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
 *                   example: Invalid role provided
 *       404:
 *         description: User not found
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
 *                   example: User not found
 */
userRoutes.patch(
  "/:id/role",
  authenticate,
  authorize("ADMIN"),
  updateUserRoleController,
);

/**
 * @swagger
 * /api/users/{id}/status:
 *   patch:
 *     summary: Update user status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 example: ACTIVE
 *     responses:
 *       200:
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User status updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 276dc2fc-ee3d-4c9a-b531-3ff8ea8127c5
 *                     name:
 *                       type: string
 *                       example: name
 *                     email:
 *                       type: string
 *                       example: email@gmail.com
 *                     role:
 *                       type: string
 *                       example: VIEWER
 *                     status:
 *                       type: string
 *                       example: ACTIVE
 *                     createdAt:
 *                       type: string
 *                       example: 2026-04-02T06:42:06.474Z
 *       400:
 *         description: Invalid status provided
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
 *                   example: Invalid status provided
 *       404:
 *         description: User not found
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
 *                   example: User not found
 */
userRoutes.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  updateUserStatusController,
);

export default userRoutes;
