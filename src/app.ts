import express from "express";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import transactionRoutes from "./modules/transactions/transactions.routes";
import "./config/db";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import rateLimit from "express-rate-limit";

dotenv.config({ path: "../.env" });

const app = express();

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: "error",
    message: "Too many requests, please try again later",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    status: "error",
    message: "Too many attempts, please try again later"
  }
})

app.use(express.json());
app.use(cors());
app.use(generalLimiter)
app.use("/api/auth", authLimiter)

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
