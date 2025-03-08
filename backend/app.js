import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

// import rotues
import authRouter from "./routes/auth.routes.js";

// routes declaration
app.use("/api/v1/auth", authRouter);

export {app};