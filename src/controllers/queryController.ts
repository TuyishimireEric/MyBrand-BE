import Query, { QueryInterface, QueryStatus } from "../models/Query";
import _ from "lodash";
import { Request, Response } from "express";
import {
  expectedParams,
  expectedQuery,
  expectedQueryStatus,
} from "../utils/validations";

export const createQuery = async (req: Request, res: Response) => {
  const queryData: Partial<QueryInterface> = _.pick(req.body, [
    "name",
    "email",
    "description",
  ]);
  const { error } = expectedQuery.validate(queryData);

  if (error) {
    res.status(400).send({ data: [], message: "", error: error.message });
    return;
  }

  const query = new Query(queryData);
  await query.save();
  res.status(200).send({ data: query, message: "Query created successfully!!", error: null });
};

export const getQueries = async (req: Request, res: Response) => {
  const queries = await Query.find({ status: { $in: ["read", "unread"] } });
  res.send({ data: queries, message: "", error: null });
};

export const getQuery = async (req: Request, res: Response) => {
  // - Validate the Params ---------------------------------

  const { queryId } = req.params;
  const queryIdValid = expectedParams.validate(queryId);
  if (queryIdValid.error) {
    res
      .status(404)
      .send({ data: [], message: "", error: queryIdValid.error.message });
    return;
  }

  // - Logic -----------------------------------------------

    const query = await Query.findOne({
      _id: queryId,
      status: { $in: ["read", "unread"] },
    });

    if (!query) {
      res
        .status(404)
        .send({ data: [], message: "query not found", error: null });
      return;
    }
    res.send({data: query, message: "query not found", error: null });
};

export const updateQuery = async (req: Request, res: Response) => {
  // - Validate the Params ---------------------------------

  const { queryId } = req.params;
  const queryIdValid = expectedParams.validate(queryId);
  if (queryIdValid.error) {
    res
      .status(404)
      .send({ data: [], message: "", error: queryIdValid.error.message });
    return;
  }

  const queryStatus: QueryStatus = req.body.status;
  const { error } = expectedQueryStatus.validate({ status: queryStatus });

  if (error) {
    res.status(400).send({ data: [], message: "", error: error.message });
    return;
  }

    const query = await Query.findByIdAndUpdate(
      queryId,
      {
        status: queryStatus,
      },
      { new: true }
    );

    if (!query) {
      res
        .status(404)
        .send({ data: [], message: "query not found", error: null });
      return;
    }
    res.send({ data: query, message: "Query updated successfully!!", error: null });

};

export const deleteQuery = async(req: Request, res: Response)=>{
  const { queryId } = req.params;
  const queryIdValid = expectedParams.validate(queryId);
  if (queryIdValid.error) {
    res
      .status(404)
      .send({ data: [], message: "", error: queryIdValid.error.message });
    return;
  }

  // - Logic -----------------------------------------------

    const query = await Query.deleteOne({_id: queryId})
    if (query.deletedCount == 0) {
      res
        .status(404)
        .send({ data: [], message: "query not found", error: null });
      return;
    }
    res.send({ data: [], message: "Query deleted successfully!!", error: null });
}