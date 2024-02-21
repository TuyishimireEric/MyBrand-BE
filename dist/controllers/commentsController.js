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
exports.getAComment = exports.getBlogComments = exports.updateComment = exports.createComment = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const Blog_1 = __importDefault(require("../models/Blog"));
const validations_1 = require("../utils/validations");
const lodash_1 = __importDefault(require("lodash"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // - Validate the Params ---------------------------------
    const { blogId } = req.params;
    const blogIdValid = validations_1.expectedParams.validate(blogId);
    if (blogIdValid.error) {
        res
            .status(404)
            .send({ data: [], message: "", error: blogIdValid.error.message });
        return;
    }
    // - Validate the body -------------------------------------
    const commentData = lodash_1.default.pick(req.body, [
        "commentedBy",
        "description",
    ]);
    const { error } = validations_1.expectedComment.validate(commentData);
    if (error) {
        res.status(404).send({ data: [], message: "", error: error.message });
        return;
    }
    // - Logic -----------------------------------------------
    try {
        const blogExist = yield Blog_1.default.exists({ _id: blogId });
        if (blogExist) {
            const newComment = {
                blogId: blogId,
                commentedBy: commentData.commentedBy,
                description: commentData.description,
            };
            try {
                const comment = new Comment_1.default(newComment);
                const result = yield comment.save();
                res.send(result);
            }
            catch (error) {
                res.status(400).send({ data: [], message: "", error: error.message });
            }
        }
        else {
            res
                .status(404)
                .send({ data: [], message: "blog not found!", error: null });
            return;
        }
    }
    catch (error) {
        res.status(400).send({ data: [], message: "", error: error.message });
    }
});
exports.createComment = createComment;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // - Validate the Params ---------------------------------
    var _a, _b;
    const { blogId, commentId } = req.params;
    const blogIdValid = validations_1.expectedParams.validate(blogId);
    const commentIdValid = validations_1.expectedParams.validate(commentId);
    if (blogIdValid.error || commentIdValid.error) {
        res.status(404).send({
            data: [],
            message: "",
            error: ((_a = blogIdValid.error) === null || _a === void 0 ? void 0 : _a.message) || ((_b = commentIdValid.error) === null || _b === void 0 ? void 0 : _b.message),
        });
        return;
    }
    const { error } = validations_1.expectedCommentUpdate.validate(req.body);
    if (error) {
        res.status(400).send({ data: [], message: "", error: error.message });
        return;
    }
    // - Logic -----------------------------------------------
    const blogExist = yield Blog_1.default.exists({ _id: blogId });
    if (blogExist) {
        try {
            const comment = yield Comment_1.default.findByIdAndUpdate(commentId, {
                visible: req.body.visible,
            }, {
                new: true,
            });
            if (!comment) {
                res
                    .status(400)
                    .send({ data: [], message: "Comment no found!", error: null });
                return;
            }
            res.send(comment);
        }
        catch (error) {
            res.status(400).send({ data: [], message: "", error: error.message });
        }
    }
    else {
        res.status(404).send({ data: [], message: "Blog no found!", error: null });
        return;
    }
});
exports.updateComment = updateComment;
const getBlogComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // - Validate the Params ---------------------------------
    const { blogId } = req.params;
    const blogIdValid = validations_1.expectedParams.validate(blogId);
    if (blogIdValid.error) {
        res
            .status(404)
            .send({ data: [], message: "", error: blogIdValid.error.message });
        return;
    }
    // - Logic -----------------------------------------------
    const blogExist = yield Blog_1.default.exists({ _id: blogId });
    if (blogExist) {
        try {
            const comments = yield Comment_1.default.find({
                blogId: req.params.blogId,
                visible: true,
            });
            if (comments.length === 0) {
                res.status(404).send({
                    data: [],
                    message: "No comments found for this blog",
                    error: null,
                });
            }
            else {
                res.status(200).send({ data: comments, message: "", error: null });
            }
        }
        catch (error) {
            res.status(500).send({ data: [], message: "", error: error.message });
        }
    }
    else {
        res.status(404).send("blog not found!");
        return;
    }
});
exports.getBlogComments = getBlogComments;
const getAComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // - Validate the Params ---------------------------------
    var _c, _d;
    const { blogId, commentId } = req.params;
    const blogIdValid = validations_1.expectedParams.validate(blogId);
    const commentIdValid = validations_1.expectedParams.validate(commentId);
    if (blogIdValid.error || commentIdValid.error) {
        res.status(404).send({
            data: [],
            message: "",
            error: ((_c = blogIdValid.error) === null || _c === void 0 ? void 0 : _c.message) || ((_d = commentIdValid.error) === null || _d === void 0 ? void 0 : _d.message),
        });
        return;
    }
    // - Logic -----------------------------------------------
    const blogExist = yield Blog_1.default.exists({ _id: blogId });
    if (blogExist) {
        try {
            const comment = yield Comment_1.default.findOne({ _id: req.params.commentId });
            if (comment) {
                res.status(200).send({ data: comment, message: "", error: null });
            }
            else {
                res
                    .status(400)
                    .send({ data: [], message: "Comments not found !!", error: null });
            }
        }
        catch (error) {
            res.status(400).send({ data: [], message: "", error: error.message });
        }
    }
    else {
        res
            .status(404)
            .send({ data: [], message: "Blog not found !!", error: null });
        return;
    }
});
exports.getAComment = getAComment;
