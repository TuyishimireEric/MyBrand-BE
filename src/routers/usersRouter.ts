import express from "express";
const router = express.Router();
import * as Users from "../controllers/usersController";

router.post("/signup", Users.createUser);
router.post("/login", Users.loginUser)

export default router;