import express from "express";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";
import "./config/db";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors"

dotenv.config({ path: "../.env" });

const app = express();

app.use(express.json());
app.use(cors())

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
