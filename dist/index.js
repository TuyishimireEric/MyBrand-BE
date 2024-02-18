"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const blogsRouter_1 = __importDefault(require("./routers/blogsRouter"));
const queryRouter_1 = __importDefault(require("./routers/queryRouter"));
mongoose_1.default
    .connect("mongodb://localhost:27017/MyBland")
    .then(() => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/api/blogs/", blogsRouter_1.default);
    app.use("/api/query/", queryRouter_1.default);
    app.listen(5000, () => {
        console.log("Server has started!");
    });
});
