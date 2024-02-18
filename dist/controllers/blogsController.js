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
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogData = lodash_1.default.pick(req.body, [
        "title",
        "image",
        "description",
    ]);
    const { error } = validations_1.expectedBlog.validate(blogData);
    if (error) {
        res.status(400).send({ error: error.message });
        return;
    }
    blogData.createdBy = "Tuyishimire Eric";
    const blog = new Blog_1.default(blogData);
    yield blog.save();
    res.send(blog);
});
exports.createBlog = createBlog;
const getBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield Blog_1.default.find();
    res.send(blogs);
});
exports.getBlogs = getBlogs;
const getBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.blogId) {
        res.status(404).send({ error: "No Id provided" });
        return;
    }
    try {
        const blog = yield Blog_1.default.findOne({ _id: req.params.blogId });
        if (!blog) {
            res.status(404).send({ error: "blog not found" });
            return;
        }
        res.send(blog);
    }
    catch (_a) {
        res.status(404);
        res.send({ error: "Blog doesn't exist!" });
    }
});
exports.getBlog = getBlog;
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // - Validate the Params ---------------------------------
    const { blogId } = req.params;
    const blogIdValid = validations_1.expectedParams.validate(blogId);
    if (blogIdValid.error) {
        res.status(404).send({ error: blogIdValid.error.message });
        return;
    }
    const blogData = lodash_1.default.pick(req.body, [
        "title",
        "image",
        "description",
    ]);
    const { error } = validations_1.expectedBlog.validate(blogData);
    if (error) {
        res.status(400).send({ error: error.message });
        return;
    }
    try {
        const blog = yield Blog_1.default.findByIdAndUpdate(blogId, {
            title: req.body.title,
            image: req.body.image,
            description: req.body.description,
        }, { new: true });
        if (!blog) {
            res.status(404).send({ error: "blog not found" });
            return;
        }
        res.send(blog);
    }
    catch (error) {
        res.status(404).send({ error: error.message });
    }
});
exports.updateBlog = updateBlog;
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // - Validate the Params ---------------------------------
    const { blogId } = req.params;
    const blogIdValid = validations_1.expectedParams.validate(blogId);
    if (blogIdValid.error) {
        res.status(404).send({ error: blogIdValid.error.message });
        return;
    }
    try {
        const blog = yield Blog_1.default.deleteOne({ _id: blogId });
        if (blog.deletedCount == 0) {
            res.status(404).send({ error: "blog not found" });
            return;
        }
        res.status(200).send("blog deleted successfully!");
    }
    catch (error) {
        res.status(404).send({ error: error.message });
    }
});
exports.deleteBlog = deleteBlog;
