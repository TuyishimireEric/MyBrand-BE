import express from "express";
import mongoose from "mongoose";
import blogsRouter from "./routers/blogsRouter";
import queryRouter from "./routers/queryRouter";
import userRouter from "./routers/usersRouter";
import dotenv from "dotenv";
import swaggerDocuments from "./utils/swagger";
import swaggerUI,{SwaggerUiOptions} from "swagger-ui-express";

dotenv.config();

export const DBUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mybranddata.xewqsqw.mongodb.net/?retryWrites=true&w=majority&appName=myBrandData`;
// export const DBUrl = "mongodb://localhost:27017/MyBland";

const app = express();


app.use(express.json());


app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDocuments));
app.use("/api/blogs/", blogsRouter);
app.use("/api/query/", queryRouter);
app.use("/api/users/", userRouter);




export default app;
