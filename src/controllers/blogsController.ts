import Blog, { BlogInterface } from "../models/Blog";
import _ from "lodash";
import { Request, Response } from "express";
import { expectedBlog, expectedParams } from "../utils/validations";

export const createBlog = async (req: Request, res: Response) => {
  const blogData: Partial<BlogInterface> = _.pick(req.body, [
    "title",
    "image",
    "description",
  ]);
  const { error } = expectedBlog.validate(blogData);

  if (error) {
    res.status(400).send({ error: error.message });
    return;
  }

  blogData.createdBy = "Tuyishimire Eric";
  const blog = new Blog(blogData);
  await blog.save();
  res.send(blog);
};

export const getBlogs = async (req: Request, res: Response) => {
  const blogs = await Blog.find();
  res.send(blogs);
};

export const getBlog = async (req: Request, res: Response) => {
  if (!req.params.blogId) {
    res.status(404).send({ error: "No Id provided" });
    return;
  }

  try {
    const blog = await Blog.findOne({ _id: req.params.blogId });
    if (!blog) {
      res.status(404).send({ error: "blog not found" });
      return;
    }
    res.send(blog);
  } catch {
    res.status(404);
    res.send({ error: "Blog doesn't exist!" });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
   // - Validate the Params ---------------------------------

   const { blogId } = req.params;
   const blogIdValid = expectedParams.validate(blogId);
   if (blogIdValid.error) {
     res.status(404).send({ error: blogIdValid.error.message });
     return;
   }

  const blogData: Partial<BlogInterface> = _.pick(req.body, [
    "title",
    "image",
    "description",
  ]);
  const { error } = expectedBlog.validate(blogData);

  if (error) {
    res.status(400).send({ error: error.message });
    return;
  }

  try {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title: req.body.title,
        image: req.body.image,
        description: req.body.description,
      },
      { new: true }
    );

    if (!blog) {
      res.status(404).send({ error: "blog not found" });
      return;
    }
    res.send(blog);
  } catch (error: any) {
    res.status(404).send({ error: error.message });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  // - Validate the Params ---------------------------------

  const { blogId } = req.params;
  const blogIdValid = expectedParams.validate(blogId);
  if (blogIdValid.error) {
    res.status(404).send({ error: blogIdValid.error.message });
    return;
  }

  try {
    const blog = await Blog.deleteOne({ _id: blogId});
    if (blog.deletedCount == 0) {
      res.status(404).send({ error: "blog not found" });
      return;
    }
    res.status(200).send("blog deleted successfully!");
  } catch (error: any){
    res.status(404).send({ error: error.message });
  }
};
