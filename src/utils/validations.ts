import Joi from "joi";
import { QueryStatus } from "../models/Query";

export const expectedBlog = Joi.object({
  title: Joi.string().min(4).max(30).required(),
  image: Joi.string().required(),
  description: Joi.string().required(),
});

export const expectedQuery = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  description: Joi.string().min(3).max(500).required(),
});

export const expectedQueryStatus = Joi.object({
  status: Joi.string()
    .valid(...Object.values(QueryStatus))
    .required(),
});

export const expectedComment = Joi.object({
  commentedBy: Joi.string().min(3).max(30).required(),
  description: Joi.string().min(3).max(500).required(),
});

export const expectedCommentUpdate = Joi.object({
  visible: Joi.boolean().required(),
});

export const expectedParams = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .message("Invalid ID");
