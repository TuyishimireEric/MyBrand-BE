import Blog, { BlogInterface } from "../models/Blog";
import _ from "lodash";
import { Request, Response } from "express";
import { expectedBlog, expectedParams } from "../utils/validations";
import { uploadFiles } from "../utils/uploadFiles";

export const createBlog = async (req: Request, res: Response) => {
  const blogData: Partial<BlogInterface> = _.pick(req.body, [
    "title",
    "description",
  ]);
  const { error } = expectedBlog.validate(blogData);

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

  const imageUrl = await uploadFiles(buffer, originalname);

  if (imageUrl) {
    try {
      const blog = new Blog({
        title: blogData.title,
        image: imageUrl,
        description: blogData.description,
        createdBy: req.user.userName,
      });

      const created = await blog.save();
      if (created) {
        res.send({
          data: created,
          message: "Blog created successfully!!",
          error: "",
        });
      }
    } catch (error: any) {
      return res
        .status(400)
        .send({ data: [], message: "Server error", error: error.message });
    }
  }
};

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find();
    res.send({ data: blogs, message: "", error: null });
  } catch (error: any) {
    return res
      .status(400)
      .send({ data: [], message: "", error: error.message });
  }
};

export const getBlog = async (req: Request, res: Response) => {
  if (!req.params.blogId) {
    return res
      .status(404)
      .send({ data: [], message: "No Id provided", error: null });
  }

  try {
    const blog = await Blog.findOne({ _id: req.params.blogId });
    if (blog) {
      res.send({ data: blog, message: "", error: null });
    } else {
      return res
        .status(404)
        .send({ data: [], message: "blog not found", error: null });
    }
  } catch {
    return res
      .status(404)
      .send({ data: [], message: "Blog doesn't exist!", error: null });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  // - Validate the Params ---------------------------------

  const { blogId } = req.params;
  const blogIdValid = expectedParams.validate(blogId);
  if (blogIdValid.error) {
    return res
      .status(404)
      .send({ data: [], message: "", error: blogIdValid.error.message });
  }

  // const blogData: Partial<BlogInterface> = _.pick(req.body, [
  //   "title",
  //   "description",
  //   "image"
  // ]);
  // const { error } = expectedBlog.validate(blogData);

  // if (error) {
  //   return res
  //     .status(400)
  //     .send({ data: [], message: "", error: error.message });
  // }

  if (!req.file && !req.body.image)
    return res
      .status(400)
      .send({ data: [], message: "No Image provided!!", error: "No Image provided!!" });

  let imageUrl = req.body.image;
  if(req.file){
    const { buffer, originalname } = req.file;
    imageUrl = await uploadFiles(buffer, originalname);
  }

  try {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title: req.body.title,
        image: imageUrl,
        description: req.body.description,
      },
      { new: true }
    );

    if (blog) {
      return res.send({
        data: blog,
        message: "Blog updated successfully!!",
        error: null,
      });
    } else {
      return res
        .status(404)
        .send({ data: [], message: "Blog not found!!", error:"Blog not found!!" });
    }
  } catch (error: any) {
    return res
      .status(404)
      .send({ data: [], message: "Server Error", error: error.message });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  // - Validate the Params ---------------------------------

  const { blogId } = req.params;
  const blogIdValid = expectedParams.validate(blogId);
  if (blogIdValid.error) {
    return res
      .status(404)
      .send({ data: [], message: "", error: blogIdValid.error.message });
  }

  try {
    const blog = await Blog.deleteOne({ _id: blogId });
    if (blog.deletedCount == 0) {
      return res
        .status(404)
        .send({ data: [], message: "Blog not found!!", error: "Blog not found!!" });
    } else {
      return res
        .status(200)
        .send({
          data: [],
          message: "Blog deleted successfully!!",
          error: null,
        });
    }
  } catch (error: any) {
    return res
      .status(404)
      .send({ data: [], message: "", error: error.message });
  }
};
