"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectedParams = exports.expectedCommentUpdate = exports.expectedComment = exports.expectedQueryStatus = exports.expectedQuery = exports.expectedBlog = exports.expectedLogin = exports.expectedNewUser = void 0;
const joi_1 = __importDefault(require("joi"));
const Query_1 = require("../models/Query");
exports.expectedNewUser = joi_1.default.object({
    userName: joi_1.default.string().min(3).max(30).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,}$/).message("Please provide a strong password")
});
exports.expectedLogin = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,}$/).message("Please provide a valid password")
});
exports.expectedBlog = joi_1.default.object({
    title: joi_1.default.string().min(4).max(30).required(),
    description: joi_1.default.string().required(),
});
exports.expectedQuery = joi_1.default.object({
    name: joi_1.default.string().min(3).max(30).required(),
    email: joi_1.default.string().email().required(),
    description: joi_1.default.string().min(3).max(500).required(),
});
exports.expectedQueryStatus = joi_1.default.object({
    status: joi_1.default.string()
        .valid(...Object.values(Query_1.QueryStatus))
        .required(),
});
exports.expectedComment = joi_1.default.object({
    commentedBy: joi_1.default.string().min(3).max(30).required(),
    description: joi_1.default.string().min(3).max(500).required(),
});
exports.expectedCommentUpdate = joi_1.default.object({
    visible: joi_1.default.boolean().required(),
});
exports.expectedParams = joi_1.default.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Invalid ID");
