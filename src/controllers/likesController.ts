import Like, { likeInterface } from "../models/Like";
import Blog from "../models/Blog";
import { Request, Response } from "express";

import _ from "lodash";
import { expectedParams } from "../utils/validations";

export const addLike = async (req: Request, res: Response) => {
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

  try {
    const blogExist = await Blog.exists({ _id: blogId });
    const user = "Paul";

    if (blogExist) {
      const newLike = {
        blogId: blogId,
        likedBy: user,
      };

      try {
        const like = new Like(newLike);
        const result = await like.save();
        const likes = await Like.find({
          blogId: blogId,
        });

        res.send({data: likes.length, message: "Liked", error: null});
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

export const getBlogLikes = async (req: Request, res: Response) => {
  // - Validate the Params ---------------------------------

  const { blogId } = req.params;
  const blogIdValid = expectedParams.validate(blogId);
  if (blogIdValid.error) {
    res.status(404).send({ data: [], message: "", error: blogIdValid.error.message });
    return;
  }

  // - Logic -----------------------------------------------

  const blogExist = await Blog.exists({ _id: blogId });

  if (blogExist) {
    try {
      const likes = await Like.find({
        blogId: blogId,
      });
      res.status(200).send({data: likes.length, message: "", error: null});
    } catch (error: any) {
      res.status(500).send({ data: [], message: "", error: error.message });
    }
  } else {
    res.status(404).send({ data: [], message:"blog not found!", error: null});
    return;
  }
};
