import express from "express";
const router = express.Router();
import * as Query from "../controllers/queryController";

router.post("/", Query.createQuery);

router.get("/", Query.getQueries);

router.get("/:queryId", Query.getQuery);

router.patch("/:queryId", Query.updateQuery);

export default router;

