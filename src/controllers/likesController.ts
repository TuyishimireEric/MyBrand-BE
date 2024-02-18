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
    res.status(404).send({ error: blogIdValid.error.message });
    return;
  }


  // - Logic -----------------------------------------------

  try {
    const blogExist = await Blog.exists({ _id: blogId });
    const user = "Paul";

    if (blogExist) {
      const newLike = {
        blogId: blogId,
        likedBy: user ,
      };

      try {
        const like = new Like(newLike);
        const result = await like.save();
        res.send(result);
      } catch (error: any) {
        res.status(400).send({ error: error.message });
      }
    } else {
      res.status(404).send("blog not found!");
      return;
    }
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
};

export const getBlogLikes = async (req: Request, res: Response) => {
  // - Validate the Params ---------------------------------

  const { blogId } = req.params;
  const blogIdValid = expectedParams.validate(blogId);
  if (blogIdValid.error) {
    res.status(404).send({ error: blogIdValid.error.message });
    return;
  }

  // - Logic -----------------------------------------------

  const blogExist = await Blog.exists({ _id: blogId });

  if (blogExist) {
    try {
      const likes = await Like.find({
        blogId: blogId
      });
        res.status(200).send(likes);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  } else {
    res.status(404).send("blog not found!");
    return;
  }
};