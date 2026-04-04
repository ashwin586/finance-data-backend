import { AuthRequest } from "../../types/interface";
import { Response } from "express";

import {
  getSummaryService,
  getByCategoryService,
  getRecentActivityService,
  getTrendsService,
} from "./dashboard.service";

export const getSummaryController = async (req: AuthRequest, res: Response) => {
  const result = await getSummaryService();
  return res.status(200).json({
    message: "Dashboard summary fetched successfully",
    data: result,
  });
};

export const getByCategoryController = async (
  req: AuthRequest,
  res: Response,
) => {
  const result = await getByCategoryService();
  return res.status(200).json({
    message: "Dashboard category summary fetched successfully",
    data: result,
  });
};

export const getRecentActivityController = async (
  req: AuthRequest,
  res: Response,
) => {
  const result = await getRecentActivityService();
  return res.status(200).json({
    message: "Recent dashboard activity fetched successfully",
    data: result,
  });
};

export const getTrendsController = async (req: AuthRequest, res: Response) => {
  const result = await getTrendsService();
  return res
    .status(200)
    .json({ message: "Trend dashboard fetched successfully", data: result });
};
