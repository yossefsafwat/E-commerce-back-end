import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./db/connection.js";
import authRouter from "./routes/auth.routes.js";
import cartRouter from "./routes/cart.routes.js"
import adminRouter from "./routes/admin.routes.js"
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";
import orderRouter from "./routes/order.routes.js";
import adminUserRouter from "./routes/admin.user.routes.js";
import userRouter from "./routes/user.routes.js";
import productsRouter from "./routes/product.routes.js"
import reviewRouter from "./routes/review.routes.js"
import wishlistRoutes from "./routes/wishlist.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import { handleStripeWebhook } from "./controllers/payment.controllers.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

const PORT = process.env.PORT || 3000;

dns.setServers(["8.8.8.8", "8.8.4.4"]);
app.set("trust proxy", 1);

// CRITICAL: Stripe Webhook requires Raw Buffer BEFORE express.json()
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);
app.post(
  "/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../public")));

app.use("/auth", authRouter);
app.use("/carts",cartRouter)
app.use("/orders", orderRouter)
app.use("/products", productsRouter)
app.use("/products",reviewRouter)
app.use("/admin/users", adminUserRouter);
app.use("/admin",adminRouter)
app.use("/wishlists", wishlistRoutes);
app.use("/users", userRouter);
app.use("/api/payments", paymentRouter);
app.use("/payments", paymentRouter);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
