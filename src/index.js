import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import morgan from "morgan";
import connectDB from "./db/connection.js";
import MongoStore from "connect-mongo";
import authRouter from "./routes/auth.routes.js";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

const PORT = process.env.PORT || 3000;

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.set("trust proxy", 1);

app.use(
  session({
    unset: "destroy",
    rolling: false,
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      ttl: 7 * 24 * 60 * 60,
      autoRemove: "native",
      touchAfter: 24 * 60 * 60,
      collectionName: "sessions",
      crypto: {
        secret: process.env.CRYPTO_SECRET,
        algorithm: "aes-256-gcm",
      },
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/auth", authRouter);

app.use((req, res, next) => {
  console.log("Session:", req.session);
  next();
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
