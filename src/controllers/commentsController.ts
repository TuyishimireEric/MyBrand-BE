import Comment, { commentInterface } from "../models/Comment";
import Blog from "../models/Blog";
import { Request, Response } from "express";
import {
  expectedComment,
  expectedCommentUpdate,
  expectedParams,
} from "../utils/validations";
import _ from "lodash";
import { error } from "console";

export const createComment = async (req: Request, res: Response) => {
  // - Validate the Params ---------------------------------

  const { blogId } = req.params;
  const blogIdValid = expectedParams.validate(blogId);
  if (blogIdValid.error) {
    res
      .status(404)
      .send({ data: [], message: "", error: blogIdValid.error.message });
    return;
  }

  // - Validate the body -------------------------------------

  const commentData: Partial<commentInterface> = _.pick(req.body, [
    "commentedBy",
    "description",
  ]);

  const { error } = expectedComment.validate(commentData);
  if (error) {
    res.status(404).send({ data: [], message: "", error: error.message });
    return;
  }

  // - Logic -----------------------------------------------

  try {
    const blogExist = await Blog.exists({ _id: blogId });

    if (blogExist) {
      const newComment = {
        blogId: blogId,
        commentedBy: commentData.commentedBy,
        description: commentData.description,
      };

      try {
        const comment = new Comment(newComment);
        const result = await comment.save();
        res.send(result);
      } catch (error: any) {
        res.status(400).send({ data: [], message: "", error: error.message });
      }
    } else {
      res
        .status(404)
        .send({ data: [], message: "blog not found!", error: null });
      return;
    }
  } catch (error: any) {
    res.status(400).send({ data: [], message: "", error: error.message });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  // - Validate the Params ---------------------------------

  const { blogId, commentId } = req.params;
  const blogIdValid = expectedParams.validate(blogId);
  const commentIdValid = expectedParams.validate(commentId);
  if (blogIdValid.error || commentIdValid.error) {
    res.status(404).send({
      data: [],
      message: "",
      error: blogIdValid.error?.message || commentIdValid.error?.message,
    });
    return;
  }

  const { error } = expectedCommentUpdate.validate(req.body);
  if (error) {
    res.status(400).send({ data: [], message: "", error: error.message });
    return;
  }

  // - Logic -----------------------------------------------

  const blogExist = await Blog.exists({ _id: blogId });

  if (blogExist) {
    try {
      const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
          visible: req.body.visible,
        },
        {
          new: true,
        }
      );

      if (!comment) {
        res
          .status(400)
          .send({ data: [], message: "Comment no found!", error: null });
        return;
      }

      res.send(comment);
    } catch (error: any) {
      res.status(400).send({ data: [], message: "", error: error.message });
    }
  } else {
    res.status(404).send({ data: [], message: "Blog no found!", error: null });
    return;
  }
};

export const getBlogComments = async (req: Request, res: Response) => {
  // - Validate the Params ---------------------------------

  const { blogId } = req.params;
  const blogIdValid = expectedParams.validate(blogId);
  if (blogIdValid.error) {
    res
      .status(404)
      .send({ data: [], message: "", error: blogIdValid.error.message });
    return;
  }

  // - Logic -----------------------------------------------

  const blogExist = await Blog.exists({ _id: blogId });

  if (blogExist) {
    try {
      const comments = await Comment.find({
        blogId: req.params.blogId,
        visible: true,
      });
      if (comments.length === 0) {
        res.status(404).send({
          data: [],
          message: "No comments found for this blog",
          error: null,
        });
      } else {
        res.status(200).send({ data: comments, message: "", error: null });
      }
    } catch (error: any) {
      res.status(500).send({ data: [], message: "", error: error.message });
    }
  } else {
    res.status(404).send("blog not found!");
    return;
  }
};

export const getAComment = async (req: Request, res: Response) => {
  // - Validate the Params ---------------------------------

  const { blogId, commentId } = req.params;
  const blogIdValid = expectedParams.validate(blogId);
  const commentIdValid = expectedParams.validate(commentId);
  if (blogIdValid.error || commentIdValid.error) {
    res.status(404).send({
      data: [],
      message: "",
      error: blogIdValid.error?.message || commentIdValid.error?.message,
    });
    return;
  }

  // - Logic -----------------------------------------------

  const blogExist = await Blog.exists({ _id: blogId });

  if (blogExist) {
    try {
      const comment = await Comment.findOne({ _id: req.params.commentId });
      if (comment) {
        res.status(200).send({ data: comment, message: "", error: null });
      } else {
        res
          .status(400)
          .send({ data: [], message: "Comments not found !!", error: null });
      }
    } catch (error: any) {
      res.status(400).send({ data: [], message: "", error: error.message });
    }
  } else {
    res
      .status(404)
      .send({ data: [], message: "Blog not found !!", error: null });
    return;
  }
};
