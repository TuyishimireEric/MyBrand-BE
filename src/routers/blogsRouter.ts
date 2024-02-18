import express from "express";
const router = express.Router();
import * as Blogs from "../controllers/blogsController";
import * as Comments from "../controllers/commentsController";
import * as Likes from "../controllers/likesController";

router.get("/", Blogs.getBlogs); 
router.post("/", Blogs.createBlog);
router.get("/:blogId", Blogs.getBlog);
router.patch("/:blogId", Blogs.updateBlog);
router.delete("/:blogId", Blogs.deleteBlog);

// ------------------ COMMENTS ------------------- //

router.get("/:blogId/comments/", Comments.getBlogComments);
router.post("/:blogId/comments/", Comments.createComment);
router.patch("/:blogId/comments/:commentId", Comments.updateComment);
router.get("/:blogId/comments/:commentId", Comments.getAComment);

// ------------------ LIKES ------------------- //

router.post("/:blogId/likes", Likes.addLike);
router.get("/:blogId/likes/", Likes.getBlogLikes);


export default router;
