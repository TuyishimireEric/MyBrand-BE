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
exports.loginUser = exports.createUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const lodash_1 = __importDefault(require("lodash"));
const validations_1 = require("../utils/validations");
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = lodash_1.default.pick(req.body, ["userName", "email", "password"]);
    const { error } = validations_1.expectedNewUser.validate(userData);
    if (error) {
        res.status(400).send({ data: [], message: "", error: error.message });
        return;
    }
    try {
        const user = yield User_1.default.findOne({ email: userData.email });
        if (user) {
            res
                .status(400)
                .send({ data: [], message: "User already exist", error: "" });
            return;
        }
        else {
            const hashedPassword = bcryptjs_1.default.hashSync(userData.password, 9);
            const newUser = new User_1.default(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
            const created = yield newUser.save();
            if (created) {
                const jwtSecret = process.env.JWT_SECRET || "secret";
                const tokenExpire = process.env.TOKEN_EXPIRES || "2h";
                const token = jsonwebtoken_1.default.sign({ userId: created._id }, jwtSecret, {
                    expiresIn: tokenExpire,
                });
                res.status(200).header("Authorization", `Bearer ${token}`).send({
                    data: token,
                    message: "Signed in successfully!!",
                    error: null,
                });
            }
        }
    }
    catch (error) {
        res.status(400).send({ data: [], message: "", error: error.message });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = lodash_1.default.pick(req.body, ["email", "password"]);
    const { error } = validations_1.expectedLogin.validate(userData);
    if (error) {
        return res
            .status(400)
            .send({ data: [], message: "", error: error.message });
    }
    try {
        const user = yield User_1.default.findOne({ email: userData.email });
        if (user) {
            const isValid = yield bcryptjs_1.default.compareSync(userData.password, user.password);
            if (!isValid) {
                return res.status(400).send({
                    data: [],
                    message: "Invalid email or password ...",
                    error: null,
                });
            }
            else {
                const jwtSecret = process.env.JWT_SECRET || "secret";
                const tokenExpire = process.env.TOKEN_EXPIRES || "2h";
                const token = jsonwebtoken_1.default.sign({ userId: user._id }, jwtSecret, {
                    expiresIn: tokenExpire,
                });
                res.status(200).header("Authorization", `Bearer ${token}`).send({
                    data: token,
                    message: "Signed in successfully!!",
                    error: null,
                });
            }
        }
        else {
            return res.status(400).send({
                data: [],
                message: "User not found please register!!",
                error: null,
            });
        }
    }
    catch (error) {
        return res
            .status(400)
            .send({ data: [], message: "", error: error.message });
    }
});
exports.loginUser = loginUser;
