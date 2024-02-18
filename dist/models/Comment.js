"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    blogId: {
        type: String,
        required: true,
        ref: "Blog"
    },
    commentedBy: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    visible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model("Comment", CommentSchema);
