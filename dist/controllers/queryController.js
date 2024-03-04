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
exports.deleteQuery = exports.updateQuery = exports.getQuery = exports.getQueries = exports.createQuery = void 0;
const Query_1 = __importDefault(require("../models/Query"));
const lodash_1 = __importDefault(require("lodash"));
const validations_1 = require("../utils/validations");
const createQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryData = lodash_1.default.pick(req.body, [
        "name",
        "email",
        "description",
    ]);
    const { error } = validations_1.expectedQuery.validate(queryData);
    if (error) {
        res.status(400).send({ data: [], message: "", error: error.message });
        return;
    }
    const query = new Query_1.default(queryData);
    yield query.save();
    res.status(200).send({ data: query, message: "Query created successfully!!", error: null });
});
exports.createQuery = createQuery;
const getQueries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queries = yield Query_1.default.find({ status: { $in: ["read", "unread"] } });
    res.send({ data: queries, message: "", error: null });
});
exports.getQueries = getQueries;
const getQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // - Validate the Params ---------------------------------
    const { queryId } = req.params;
    const queryIdValid = validations_1.expectedParams.validate(queryId);
    if (queryIdValid.error) {
        res
            .status(404)
            .send({ data: [], message: "", error: queryIdValid.error.message });
        return;
    }
    // - Logic -----------------------------------------------
    const query = yield Query_1.default.findOne({
        _id: queryId,
        status: { $in: ["read", "unread"] },
    });
    if (!query) {
        res
            .status(404)
            .send({ data: [], message: "query not found", error: null });
        return;
    }
    res.send({ data: query, message: "query not found", error: null });
});
exports.getQuery = getQuery;
const updateQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // - Validate the Params ---------------------------------
    const { queryId } = req.params;
    const queryIdValid = validations_1.expectedParams.validate(queryId);
    if (queryIdValid.error) {
        res
            .status(404)
            .send({ data: [], message: "", error: queryIdValid.error.message });
        return;
    }
    const queryStatus = req.body.status;
    const { error } = validations_1.expectedQueryStatus.validate({ status: queryStatus });
    if (error) {
        res.status(400).send({ data: [], message: "", error: error.message });
        return;
    }
    const query = yield Query_1.default.findByIdAndUpdate(queryId, {
        status: queryStatus,
    }, { new: true });
    if (!query) {
        res
            .status(404)
            .send({ data: [], message: "query not found", error: null });
        return;
    }
    res.send({ data: query, message: "Query updated successfully!!", error: null });
});
exports.updateQuery = updateQuery;
const deleteQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { queryId } = req.params;
    const queryIdValid = validations_1.expectedParams.validate(queryId);
    if (queryIdValid.error) {
        res
            .status(404)
            .send({ data: [], message: "", error: queryIdValid.error.message });
        return;
    }
    // - Logic -----------------------------------------------
    const query = yield Query_1.default.deleteOne({ _id: queryId });
    if (query.deletedCount == 0) {
        res
            .status(404)
            .send({ data: [], message: "query not found", error: null });
        return;
    }
    res.send({ data: [], message: "Query deleted successfully!!", error: null });
});
exports.deleteQuery = deleteQuery;
