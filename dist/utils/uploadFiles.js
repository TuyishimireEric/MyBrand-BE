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
exports.uploadFiles = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
const uploadFiles = (buffer, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const tempFilePath = path_1.default.join(os_1.default.tmpdir(), fileName);
        fs_1.default.writeFile(tempFilePath, buffer, (writeError) => {
            if (writeError) {
                reject(writeError);
                return;
            }
            cloudinary_1.v2.uploader.upload(tempFilePath, (uploadError, result) => {
                fs_1.default.unlink(tempFilePath, (unlinkError) => {
                    if (unlinkError) {
                        console.error('Failed to delete temporary file:', unlinkError);
                    }
                });
                if (uploadError) {
                    reject(new Error(uploadError.message));
                }
                else {
                    const uploadResult = result.secure_url;
                    resolve(uploadResult);
                }
            });
        });
    });
});
exports.uploadFiles = uploadFiles;
