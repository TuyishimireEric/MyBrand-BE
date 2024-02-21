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
exports.deleteBlog = exports.updateBlog = exports.getBlog = exports.getBlogs = exports.createBlog = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
const lodash_1 = __importDefault(require("lodash"));
const validations_1 = require("../utils/validations");
const uploadFiles_1 = require("../utils/uploadFiles");
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogData = lodash_1.default.pick(req.body, [
        "title",
        "description",
    ]);
    const { error } = validations_1.expectedBlog.validate(blogData);
    if (error) {
        return res
            .status(400)
            .send({ data: [], message: "", error: error.message });
    }
    if (!req.user || !("userName" in req.user)) {
        return res.send({ data: [], message: "No UserName provided", error: null });
    }
    if (!req.file)
        return res
            .status(400)
            .send({ data: [], message: "No Image provided", error: null });
    const { buffer, originalname } = req.file;
    const imageUrl = yield (0, uploadFiles_1.uploadFiles)(buffer, originalname);
    if (imageUrl) {
        try {
            const blog = new Blog_1.default({
                title: blogData.title,
                image: imageUrl,
                description: blogData.description,
                createdBy: req.user.userName,
            });
            const created = yield blog.save();
            if (created) {
                res.send({
                    data: created,
                    message: "Blog created successfully!!",
                    error: "",
                });
            }
        }
        catch (error) {
            return res
                .status(400)
                .send({ data: [], message: "", error: error.message });
        }
    }
});
exports.createBlog = createBlog;
const getBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield Blog_1.default.find();
        res.send({ data: blogs, message: "", error: null });
    }
    catch (error) {
        return res
            .status(400)
            .send({ data: [], message: "", error: error.message });
    }
});
exports.getBlogs = getBlogs;
const getBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.blogId) {
        return res
            .status(404)
            .send({ data: [], message: "No Id provided", error: null });
    }
    try {
        const blog = yield Blog_1.default.findOne({ _id: req.params.blogId });
        if (blog) {
            res.send({ data: blog, message: "", error: null });
        }
        else {
            return res
                .status(404)
                .send({ data: [], message: "blog not found", error: null });
        }
    }
    catch (_a) {
        return res
            .status(404)
            .send({ data: [], message: "Blog doesn't exist!", error: null });
    }
});
exports.getBlog = getBlog;
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // - Validate the Params ---------------------------------
    const { blogId } = req.params;
    const blogIdValid = validations_1.expectedParams.validate(blogId);
    if (blogIdValid.error) {
        return res
            .status(404)
            .send({ data: [], message: "", error: blogIdValid.error.message });
    }
    const blogData = lodash_1.default.pick(req.body, [
        "title",
        "description",
    ]);
    const { error } = validations_1.expectedBlog.validate(blogData);
    if (error) {
        return res
            .status(400)
            .send({ data: [], message: "", error: error.message });
    }
    if (!req.file)
        return res
            .status(400)
            .send({ data: [], message: "No Image provided!!", error: "" });
    const { buffer, originalname } = req.file;
    const imageUrl = yield (0, uploadFiles_1.uploadFiles)(buffer, originalname);
    try {
        const blog = yield Blog_1.default.findByIdAndUpdate(blogId, {
            title: req.body.title,
            image: imageUrl,
            description: req.body.description,
        }, { new: true });
        if (blog) {
            res.send({
                data: blog,
                message: "Blog updated successfully!!",
                error: null,
            });
        }
        else {
            return res
                .status(404)
                .send({ data: [], message: "Blog not found!!", error: null });
        }
    }
    catch (error) {
        return res
            .status(404)
            .send({ data: [], message: "", error: error.message });
    }
});
exports.updateBlog = updateBlog;
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // - Validate the Params ---------------------------------
    const { blogId } = req.params;
    const blogIdValid = validations_1.expectedParams.validate(blogId);
    if (blogIdValid.error) {
        return res
            .status(404)
            .send({ data: [], message: "", error: blogIdValid.error.message });
    }
    try {
        const blog = yield Blog_1.default.deleteOne({ _id: blogId });
        if (blog.deletedCount == 0) {
            return res
                .status(404)
                .send({ data: [], message: "Blog not found!!", error: null });
        }
        else {
            return res
                .status(200)
                .send({
                data: [],
                message: "Blog deleted successfully!!",
                error: null,
            });
        }
    }
    catch (error) {
        return res
            .status(404)
            .send({ data: [], message: "", error: error.message });
    }
});
exports.deleteBlog = deleteBlog;
