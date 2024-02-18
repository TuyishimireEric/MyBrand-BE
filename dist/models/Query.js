"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var QueryStatus;
(function (QueryStatus) {
    QueryStatus["Read"] = "read";
    QueryStatus["UnRead"] = "unRead";
    QueryStatus["Hidden"] = "hidden";
})(QueryStatus || (exports.QueryStatus = QueryStatus = {}));
const querySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['read', 'unread', 'hidden'],
        default: 'unread'
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Query", querySchema);
