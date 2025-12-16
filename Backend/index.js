import bcrypt from "bcryptjs";

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

import AuthRouter from "./Routes/AuthRoute.js";
import CourseRouter from "./Routes/CourseRoute.js";
import QuizRouter from "./Routes/QuizRoute.js";
import ProfileRouter from "./Routes/ProfileRoute.js";
import AdminRouter from "./Routes/AdminRoutes.js";

const app = express();
const { MONGO_URL, PORT } = process.env;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is Connected Successfully "))
  .catch((err) => console.error(err));

app.use(bodyParser.json());
app.use(
  cors({
    // origin: "https://lms-qidz.vercel.app",
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/auth", AuthRouter);
app.use("/profile", ProfileRouter);
app.use("/course", CourseRouter);
app.use("/quiz", QuizRouter);
app.use("/admin", AdminRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`);
});
