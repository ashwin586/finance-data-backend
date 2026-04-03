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

userRoutes.get("/", authenticate, authorize("ADMIN"), getAllUsersController);
userRoutes.get("/:id", authenticate, authorize("ADMIN"), getUserByIdController);
userRoutes.patch(
  "/:id/role",
  authenticate,
  authorize("ADMIN"),
  updateUserRoleController,
);
userRoutes.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  updateUserStatusController,
);

export default userRoutes;
