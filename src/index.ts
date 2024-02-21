 
import express from "express";
import mongoose from "mongoose";
import blogsRouter from "./routers/blogsRouter";
import queryRouter from "./routers/queryRouter";
import userRouter from "./routers/usersRouter";

mongoose
  .connect("mongodb://localhost:27017/MyBland")
  .then(() => {
    const app = express();
    app.use(express.json());
    app.use("/api/blogs/", blogsRouter);
    app.use("/api/query/", queryRouter);
    app.use("/api/users/", userRouter);

    app.listen(5000, () => {
      console.log("Server has started!");
    });
  });
