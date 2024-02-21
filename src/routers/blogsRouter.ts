import express from "express";
const router = express.Router();
import * as Blogs from "../controllers/blogsController";
import * as Comments from "../controllers/commentsController";
import * as Likes from "../controllers/likesController";
import { isAdmin, isAuthenticated } from "../middleware/authentication";
import { handleFileUpload } from "../middleware/multerUpload";

// ------------------ BLOGS ------------------- //

router.get("/", Blogs.getBlogs); 
router.post("/", isAuthenticated, isAdmin, handleFileUpload, Blogs.createBlog);
router.get("/:blogId", Blogs.getBlog);
router.patch("/:blogId", isAuthenticated, isAdmin, handleFileUpload, Blogs.updateBlog);
router.delete("/:blogId", isAuthenticated, isAdmin, Blogs.deleteBlog);

// ------------------ COMMENTS ------------------- //

router.get("/:blogId/comments/", Comments.getBlogComments);
router.post("/:blogId/comments/", isAuthenticated, Comments.createComment);
router.patch("/:blogId/comments/:commentId", isAuthenticated, isAdmin, Comments.updateComment);
router.get("/:blogId/comments/:commentId", Comments.getAComment);

// ------------------ LIKES ------------------- //

router.post("/:blogId/likes", Likes.addLike);
router.get("/:blogId/likes/", Likes.getBlogLikes);


export default router;
