import express from "express";
const router = express.Router();
import * as Users from "../controllers/usersController";
import { isAdmin, isAuthenticated } from "../middleware/authentication";

router.post("/signup", Users.createUser);
router.post("/login", Users.loginUser);
router.delete("/:userId", isAuthenticated, isAdmin, Users.deleteUser);
router.get("/find", isAuthenticated, isAdmin, Users.getUser);

export default router;


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     token:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       name: Authorization
 *       in: header
 *   security:
 *     - token: []
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The email of a user
 *         password:
 *           type: string
 *           description: The password of a user
 * 
 *       example:
 *          email: tuyishimireericc@gmail.com,
 *          password: Eric@196
 */




/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       201:
 *         description: Login  successfully;
 *         content:
 *           application/json:
 *             schema:
 *             $ref: '#/components/schemas/Login'
 *       500:
 *         description: Server error
 *       
 *       400:
 *         description: Invalid login credentials
 */
