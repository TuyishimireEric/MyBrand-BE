import express from "express";
const router = express.Router();
import * as Query from "../controllers/queryController";
import { isAdmin, isAuthenticated } from "../middleware/authentication";

router.post("/", Query.createQuery);
router.get("/", isAuthenticated, isAdmin, Query.getQueries);
router.get("/:queryId", isAuthenticated, isAdmin, Query.getQuery);
router.patch("/:queryId", isAuthenticated, isAdmin, Query.updateQuery);

export default router;

