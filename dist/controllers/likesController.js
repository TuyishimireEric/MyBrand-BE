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
exports.getBlogLikes = exports.addLike = void 0;
const Like_1 = __importDefault(require("../models/Like"));
const Blog_1 = __importDefault(require("../models/Blog"));
const validations_1 = require("../utils/validations");
const addLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // - Validate the Params ---------------------------------
    const { blogId } = req.params;
    const blogIdValid = validations_1.expectedParams.validate(blogId);
    if (blogIdValid.error) {
        res.status(404).send({ error: blogIdValid.error.message });
        return;
    }
    // - Logic -----------------------------------------------
    try {
        const blogExist = yield Blog_1.default.exists({ _id: blogId });
        const user = "Paul";
        if (blogExist) {
            const newLike = {
                blogId: blogId,
                likedBy: user,
            };
            try {
                const like = new Like_1.default(newLike);
                const result = yield like.save();
                res.send(result);
            }
            catch (error) {
                res.status(400).send({ error: error.message });
            }
        }
        else {
            res.status(404).send("blog not found!");
            return;
        }
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
});
exports.addLike = addLike;
const getBlogLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // - Validate the Params ---------------------------------
    const { blogId } = req.params;
    const blogIdValid = validations_1.expectedParams.validate(blogId);
    if (blogIdValid.error) {
        res.status(404).send({ error: blogIdValid.error.message });
        return;
    }
    // - Logic -----------------------------------------------
    const blogExist = yield Blog_1.default.exists({ _id: blogId });
    if (blogExist) {
        try {
            const likes = yield Like_1.default.find({
                blogId: blogId
            });
            res.status(200).send(likes);
        }
        catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
    else {
        res.status(404).send("blog not found!");
        return;
    }
});
exports.getBlogLikes = getBlogLikes;
