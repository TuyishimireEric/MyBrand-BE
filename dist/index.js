"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBUrl = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const blogsRouter_1 = __importDefault(require("./routers/blogsRouter"));
const queryRouter_1 = __importDefault(require("./routers/queryRouter"));
const usersRouter_1 = __importDefault(require("./routers/usersRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DBUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mybranddata.xewqsqw.mongodb.net/?retryWrites=true&w=majority&appName=myBrandData`;
// const DBUrlLocal = "mongodb://localhost:27017/MyBland";
const app = (0, express_1.default)();
mongoose_1.default.connect(exports.DBUrl)
    .then(() => {
    console.log("Connected to MongoDB!");
    app.use(express_1.default.json());
    app.use("/api/blogs/", blogsRouter_1.default);
    app.use("/api/query/", queryRouter_1.default);
    app.use("/api/users/", usersRouter_1.default);
    // Start the server
    app.listen(5000, () => {
        console.log("Server has started!");
    });
})
    .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});
exports.default = app;
