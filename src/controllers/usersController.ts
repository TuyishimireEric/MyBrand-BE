import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import _ from "lodash";
import { expectedLogin, expectedNewUser } from "../utils/validations";
import { Response, Request } from "express";
import User from "../models/User";
import { expectedParams } from "../utils/validations";
import Joi from "joi";

dotenv.config();

export const createUser = async (req: Request, res: Response) => {
  const userData = _.pick(req.body, ["userName", "email", "password"]);

  const { error } = expectedNewUser.validate(userData);
  if (error) {
    return res.status(400).send({ data: [], message: "", error: error.message });
  }

    const user = await User.findOne({ email: userData.email });
    if (user) {
        return res
        .status(400)
        .send({ data: [], message: "User already exist", error: "" });
      
    } else {
      const hashedPassword = bcrypt.hashSync(userData.password, 9);
      const newUser = new User({ ...userData, password: hashedPassword });
      const created = await newUser.save();
      if (created) {
        const jwtSecret = (process.env.JWT_SECRET as string) || "secret";
        const tokenExpire = process.env.TOKEN_EXPIRES || "2h";
        const token = jwt.sign({ userId: created._id }, jwtSecret, {
          expiresIn: tokenExpire,
        });

        res.status(200).header("Authorization", `Bearer ${token}`).send({
          data: token,
          message: "Signed in successfully!!",
          error: null,
        });
      }
    }
};

export const loginUser = async (req: Request, res: Response) => {
  const userData = _.pick(req.body, ["email", "password"]);

  const { error } = expectedLogin.validate(userData);
  if (error) {
    return res
      .status(400)
      .send({ data: [], message: "", error: error.message });
  }

    const user = await User.findOne({ email: userData.email });
    if (user) {
      const isValid = await bcrypt.compareSync(
        userData.password,
        user.password
      );
      if (!isValid) {
        return res.status(400).send({
          data: [],
          message: "Invalid email or password ...",
          error: null,
        });
      } else {
        const jwtSecret = (process.env.JWT_SECRET as string) || "secret";
        const tokenExpire = process.env.TOKEN_EXPIRES || "2h";
        const token = jwt.sign({ userId: user._id }, jwtSecret, {
          expiresIn: tokenExpire,
        });

        res.status(200).header("Authorization", `Bearer ${token}`).send({
          data: token,
          message: "Signed in successfully!!",
          error: null,
        });
      }
    } else {
      return res.status(400).send({
        data: [],
        message: "User not found please register!!",
        error: null,
      });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
  // - Validate the Params ---------------------------------

  const { userId } = req.params;
  const userIdValid = expectedParams.validate(userId);
  if (userIdValid.error) {
    return res
      .status(404)
      .send({ data: [], message: "", error: userIdValid.error.message });
  }

    const user = await User.deleteOne({ _id: userId });
    if (user.deletedCount == 0) {
      return res
        .status(404)
        .send({ data: [], message: "User not found!!", error: null });
    } else {
      return res
        .status(200)
        .send({
          data: [],
          message: "User deleted successfully!!",
          error: null,
        });
    }
};

export const getUser = async (req: Request, res: Response) => {
  // - Validate the Params ---------------------------------

  const { email } = req.body;
  const userEmailValid = Joi.string().email().validate(email);
  if (userEmailValid.error) {
    return res
      .status(404)
      .send({ data: [], message: "", error: userEmailValid.error.message });
  }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .send({ data: [], message: "User not found!!", error: null });
    } else {
      return res
        .status(200)
        .send({
          data: user,
          message: "User found successfully!!",
          error: null,
        });
    }
};
