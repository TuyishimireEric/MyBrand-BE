"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuthenticated = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
dotenv_1.default.config();
// export const isAuthenticated = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const authorization = req.header("Authorization");
//     if (!authorization) {
//       return res
//         .status(403)
//         .send({ data: [], message: "Not authorized!!", error: null });
//     } else {
//       const token = authorization.split(" ")[1];
//       if (token) {
//         const decoded: jwt.JwtPayload | string = jwt.verify(
//           token,
//           process.env.JWT_SECRET as string
//         );
//         if (typeof decoded === "string" || !("userId" in decoded)) {
//           return res.status(400).send("Invalid token.");
//         }
//         if (!decoded || !decoded.userId) {
//           return res.status(400).send("Invalid token.");
//         }
//         const user: userInterface | null = await User.findOne({
//           _id: decoded.userId,
//         });
//         if (!user) {
//           return res.status(400).send("User not found.");
//         }
//         req.user = user;
//         next();
//       } else {
//         return res.send("not authorized token..");
//       }
//     }
//   } catch (error: any) {
//     return res
//       .status(400)
//       .send({ data: [], message: "error", error: error.message });
//   }
// };
const isAuthenticated = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(400).send({ data: [], message: "error", error: err.message });
        }
        if (!user) {
            return res.status(400).send({ data: [], message: "Not authorized!!", error: null });
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.isAuthenticated = isAuthenticated;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.send("not authorized ...");
    }
    if (!("role" in req.user)) {
        return res.send("not authorized ...");
    }
    if (req.user.role === "admin") {
        next();
    }
    else {
        return res.send("unauthorized content ...");
    }
});
exports.isAdmin = isAdmin;
