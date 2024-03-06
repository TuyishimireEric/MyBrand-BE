import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import _ from "lodash";
import { Response, Request, NextFunction } from "express";
import User, { userInterface } from "../models/User";
import passport from 'passport';

dotenv.config();

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.header("Authorization");
    if (!authorization) {
      return res
        .status(403)
        .send({ data: [], message: "Not authorized!!", error: null });
    } else {
      const token = authorization.split(" ")[1];
      if (token) {
        const decoded: jwt.JwtPayload | string = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        );

        if (typeof decoded === "string" || !("userId" in decoded)) {
          return res.status(400).send("Invalid token.");
        }

        if (!decoded || !decoded.userId) {
          return res.status(400).send("Invalid token.");
        }

        const user: userInterface | null = await User.findOne({
          _id: decoded.userId,
        });

        if (!user) {
          return res.status(400).send("User not found.");
        }

        req.user = user;
        next();
      } else {
        return res.send("not authorized token..");
      }
    }
  } catch (error: any) {
    return res
      .status(400)
      .send({ data: [], message: "error", error: error.message });
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.send("not authorized ...");
  }

  if (!("role" in req.user)) {
    return res.send("not authorized ...");
  }

  if (req.user.role === "admin") {
    next();
  } else {
    return res.send("unauthorized content ...");
  }
};