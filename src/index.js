import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./db/connection.js";
import authRouter from "./routes/auth.routes.js";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";
import orderRouter from "./routes/order.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

const PORT = process.env.PORT || 3000;

dns.setServers(["8.8.8.8", "8.8.4.4"]);
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/auth", authRouter);

app.use("/orders", orderRouter)

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
