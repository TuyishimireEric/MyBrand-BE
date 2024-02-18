"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.updateQuery = exports.getQuery = exports.getQueries = exports.createQuery = void 0;
const Query_1 = __importStar(require("../models/Query"));
const lodash_1 = __importDefault(require("lodash"));
const joi_1 = __importDefault(require("joi"));
const expectedQuery = joi_1.default.object({
    name: joi_1.default.string().min(3).max(30).required(),
    email: joi_1.default.string().email().required(),
    description: joi_1.default.string().min(3).max(500).required(),
});
const expectedQueryStatus = joi_1.default.object({
    status: joi_1.default.string().valid(...Object.values(Query_1.QueryStatus)).required()
});
const createQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryData = lodash_1.default.pick(req.body, [
        "name",
        "email",
        "description",
    ]);
    const { error } = expectedQuery.validate(queryData);
    if (error) {
        res.status(400).send({ error: error.message });
        return;
    }
    const query = new Query_1.default(queryData);
    yield query.save();
    res.status(200).send(query);
});
exports.createQuery = createQuery;
const getQueries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queries = yield Query_1.default.find();
    res.send(queries);
});
exports.getQueries = getQueries;
const getQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        res.status(404).send({ error: "No Id provided" });
        return;
    }
    try {
        const query = yield Query_1.default.findOne({ _id: req.params.id });
        if (!query) {
            res.status(404).send({ error: "query not found" });
            return;
        }
        res.send(query);
    }
    catch (_a) {
        res.status(404);
        res.send({ error: "query doesn't exist!" });
    }
});
exports.getQuery = getQuery;
const updateQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryStatus = req.body.status;
    const { error } = expectedQueryStatus.validate({ status: queryStatus });
    if (error) {
        res.status(400).send({ error: error.message });
        return;
    }
    if (!req.params.id) {
        res.status(404).send({ error: "No Id provided" });
        return;
    }
    try {
        const query = yield Query_1.default.findByIdAndUpdate(req.params.id, {
            status: queryStatus
        }, { new: true });
        if (!query) {
            res.status(404).send({ error: "query not found" });
            return;
        }
        res.send(query);
    }
    catch (error) {
        res.status(404).send({ error: error.message });
    }
});
exports.updateQuery = updateQuery;
