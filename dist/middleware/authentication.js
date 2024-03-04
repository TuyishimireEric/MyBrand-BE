"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorization = req.header("Authorization");
        if (!authorization) {
            return res
                .status(403)
                .send({ data: [], message: "Not authorized!!", error: null });
        }
        else {
            const token = authorization.split(" ")[1];
            if (token) {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                if (typeof decoded === "string" || !("userId" in decoded)) {
                    return res.status(400).send("Invalid token.");
                }
                if (!decoded || !decoded.userId) {
                    return res.status(400).send("Invalid token.");
                }
                const user = yield User_1.default.findOne({
                    _id: decoded.userId,
                });
                if (!user) {
                    return res.status(400).send("User not found.");
                }
                req.user = user;
                next();
            }
            else {
                return res.send("not authorized token..");
            }
        }
    }
    catch (error) {
        return res
            .status(400)
            .send({ data: [], message: "error", error: error.message });
    }
});
exports.isAuthenticated = isAuthenticated;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.send("not authorized ...");
    }
    if (!("role" in req.user)) {
        return res.send("not authorized ...");
    }
    if (req.user.role === "admin") {
        next();
    }
    else {
        return res.send("unauthorized content ...");
    }
});
exports.isAdmin = isAdmin;
