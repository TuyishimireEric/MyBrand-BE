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
router.post("/:blogId/comments/", Comments.createComment);
router.patch("/:blogId/comments/:commentId", isAuthenticated, isAdmin, Comments.updateComment);
router.get("/:blogId/comments/:commentId", Comments.getAComment);
router.delete("/:blogId/comments/:commentId", isAuthenticated, isAdmin, Comments.deleteAComment);

// ------------------ LIKES ------------------- //

router.post("/:blogId/likes", isAuthenticated, Likes.addLike);
router.get("/:blogId/likes/", Likes.getBlogLikes);


export default router;
