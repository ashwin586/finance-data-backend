import { AuthRequest } from "../../types/interface";
import { Response } from "express";
import { Role, Status } from "@prisma/client";

import {
  getAllUserService,
  getUserByIdService,
  updateUserRoleService,
  updateUserStatusService,
} from "./users.service";
import AppError from "../../utils/AppError";

export const getAllUsersController = async (
  req: AuthRequest,
  res: Response,
) => {
  const result = await getAllUserService();
  return res
    .status(200)
    .json({ message: "Fetched all users successfully", data: result });
};

export const getUserByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  const { id } = req.params as { id: string };

  const result = await getUserByIdService(id);
  return res
    .status(200)
    .json({ message: "User fetched successfully", data: result });
};

export const updateUserRoleController = async (
  req: AuthRequest,
  res: Response,
) => {
  const { id } = req.params as { id: string };
  const { role } = req.body;

  if (!role) throw new AppError("Role is required", 400);

  const validRoles = Object.values(Role);
  if (!validRoles.includes(role)) {
    throw new AppError(`Invalid role provided`, 400);
  }

  const result = await updateUserRoleService(id, role);
  return res
    .status(200)
    .json({ message: "User role updated successfully", data: result });
};

export const updateUserStatusController = async (
  req: AuthRequest,
  res: Response,
) => {
  const { id } = req.params as { id: string };
  const { status } = req.body;

  if (!status) throw new AppError("Status is required", 400);

  const validStatus = Object.values(Status);
  if (!validStatus.includes(status)) {
    throw new AppError(`Invalid status provided`, 400);
  }

  if (id === req.user?.id && status === Status.INACTIVE) {
    throw new AppError("You cannot deactivate your own account", 400);
  }

  const result = await updateUserStatusService(id, status);
  return res
    .status(200)
    .json({ message: "User status updated successfully", data: result });
};
