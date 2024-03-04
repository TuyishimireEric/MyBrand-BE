import express from "express";
import mongoose from "mongoose";
import blogsRouter from "./routers/blogsRouter";
import queryRouter from "./routers/queryRouter";
import userRouter from "./routers/usersRouter";
import dotenv from "dotenv";

dotenv.config();

export const DBUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mybranddata.xewqsqw.mongodb.net/?retryWrites=true&w=majority&appName=myBrandData`;
// const DBUrlLocal = "mongodb://localhost:27017/MyBland";

const app = express();

mongoose.connect(DBUrl)
 .then(() => {
    console.log("Connected to MongoDB!");

    app.use(express.json());

    app.use("/api/blogs/", blogsRouter);
    app.use("/api/query/", queryRouter);
    app.use("/api/users/", userRouter);

    // Start the server
    app.listen(5000, () => {
      console.log("Server has started!");
    });
 })
 .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
 });

export default app;
