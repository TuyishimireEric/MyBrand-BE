import express from "express";
const router = express.Router();
import * as Users from "../controllers/usersController";
import { isAdmin, isAuthenticated } from "../middleware/authentication";

router.post("/signup", Users.createUser);
router.post("/login", Users.loginUser);
router.delete("/:userId", isAuthenticated, isAdmin, Users.deleteUser);
router.get("/find", isAuthenticated, isAdmin, Users.getUser);

export default router;
