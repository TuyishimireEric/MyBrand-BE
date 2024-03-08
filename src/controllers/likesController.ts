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
    if (!req.user || !("_id" in req.user)) {
      return res.send({ data: [], message: "No UserName provided", error: null });
    }
    const userId: any = req.user._id;

    if (blogExist) {
      try {
        const currentLikes = await Like.find({
          blogId: blogId,
        });

          const likedBefore = await Like.find({
            blogId: blogId,
            likedBy: userId,
          });

          if (likedBefore.length > 0) {
            const unLike = await Like.deleteOne({ _id: likedBefore[0]._id });
            if (unLike.deletedCount != 0) {
              return res.send({
                data: currentLikes.length - 1,
                message: "unLiked",
                error: null,
              });
            } else {
              return res.send({
                data: null,
                message: "Failed to unlike",
                error: "Document not found or already unliked",
              });
            }
          } else {

            const newLike = {
              blogId: blogId,
              likedBy: userId,
            };

            
            const like = new Like(newLike);
            const result = await like.save();

            return res.send({
              data: currentLikes.length + 1,
              message: "Liked",
              error: null,
            });
          }
      } catch (error: any) {
        res.status(400).send({ data: [], message: "", error: error.message });
      }
    } else {
      return res
        .status(404)
        .send({ data: [], message: "blog not found!", error: null });
    }
  } catch (error: any) {
    return res.status(400).send({ data: [], message: "", error: error.message });
  }
};

export const getBlogLikes = async (req: Request, res: Response) => {
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
      const likes = await Like.find({
        blogId: blogId,
      });
      res.status(200).send({ data: likes.length, message: "", error: null });
    } catch (error: any) {
      res.status(500).send({ data: [], message: "", error: error.message });
    }
  } else {
    res.status(404).send({ data: [], message: "blog not found!", error: null });
    return;
  }
};
