import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import morgan from "morgan";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("api/", rateLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});


app.use(`/api/v1/auth`, authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the API" });
});

// handle not found route
app.use(notFound);
app.use(errorHandler);

export default app;
