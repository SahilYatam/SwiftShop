import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

// import rotues
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/products.routes.js";
import orderRouter from "./routes/order.routes.js";
import cartRouter from "./routes/cart.routes.js";

// routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/cart", cartRouter);

export {app};