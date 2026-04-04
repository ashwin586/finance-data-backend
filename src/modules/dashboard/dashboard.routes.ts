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

dashboardRoutes.get(
  "/summary",
  authenticate,
  authorize("ADMIN", "ANALYST"),
  getSummaryController,
);
dashboardRoutes.get(
  "/by-category",
  authenticate,
  authorize("ADMIN", "ANALYST"),
  getByCategoryController,
);
dashboardRoutes.get(
  "/recent",
  authenticate,
  authorize("ADMIN", "ANALYST"),
  getRecentActivityController,
);
dashboardRoutes.get(
  "/trends",
  authenticate,
  authorize("ADMIN", "ANALYST"),
  getTrendsController,
);

export default dashboardRoutes;
