import { test, expect } from "@jest/globals";
import supertest from "supertest";
import app from "../src/index";
import { setupTests, sharedState } from "./setupTests";

setupTests();

describe(`
    ---------------------------------- 
    Query 
    ----------------------------------`, () => {
  const invalidID = "65dca38f42ec28cfbc7408ff";
  let validID: string = "";

  describe("Getting all queries", () => {
    test("user must be authorized to get all queries", async () => {
      const response = await supertest(app).get(`/api/query`);

      expect(response.body.message).toBe("Not authorized!!");
      expect(response.statusCode).toBe(403);
    });

    it("the status code should be 200", async () => {
      const response = await supertest(app)
        .get("/api/query")
        .set("Authorization", `Bearer ${sharedState.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toBeNull();
      expect(response.body.data).toHaveLength;
      validID = response.body.data[0]._id;
    });
  });

  describe("Getting a query", () => {
    it("URL must have a valid query id", async () => {
      const response = await supertest(app)
        .get(`/api/query/123`)
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.body.error).toContain("Invalid ID");
      expect(response.status).toBe(404);
    });

    it("the query should exist", async () => {
      const response = await supertest(app)
        .get(`/api/query/${invalidID}`)
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.body.message).toBe("query not found");
    });

    it("should return the query", async () => {
      const response = await supertest(app)
        .get(`/api/query/${validID}`)
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.body.error).toBeNull();
      expect(response.body.data).toBeTruthy();
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Create a query", () => {
    const payload: {
      name: string;
      email: string;
      description: string;
    } = {
      name: "Paul",
      email: "mutabazi@gmail.com",
      description: "Paul's query",
    };

    test("All fields are valid", async () => {
      const response = await supertest(app).post(`/api/query/`);
      expect(response.body.error).toContain("is required");
    });

    test("should create the query", async () => {
      const response = await supertest(app).post(`/api/query/`).send(payload);
      expect(response.body.data).toBeTruthy();
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Query created successfully!!");
      validID = response.body.data._id;
    });
  });

  describe("Update a query", () => {
    const payload: {
      status: string;
    } = {
      status: "hidden",
    };

    test("user should be authorized ", async () => {
      const response = await supertest(app).patch(`/api/query/${validID}`);
      expect(response.body.message).toContain("Not authorized!!");
    });

    test("status should be sent ", async () => {
      const response = await supertest(app)
        .patch(`/api/query/${validID}`)
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.body.error).toContain("is required");
    });

    test("queryId should be valid", async () => {
      const response = await supertest(app)
        .patch(`/api/query/123`)
        .set("Authorization", `Bearer ${sharedState.token}`)
        .send(payload);

      expect(response.body.error).toBe("Invalid ID");
    });

    test("queryId should exist", async () => {
      const response = await supertest(app)
        .patch(`/api/query/${invalidID}`)
        .set("Authorization", `Bearer ${sharedState.token}`)
        .send(payload);

      expect(response.body.message).toBe("query not found");
    });

    test("should update the query", async () => {
      const response = await supertest(app)
        .patch(`/api/query/${validID}`)
        .set("Authorization", `Bearer ${sharedState.token}`)
        .send(payload);

      expect(response.body.data).toBeTruthy();
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Query updated successfully!!");
    });
  });

  describe("Delete a query", () => {
    test("user should be authorized ", async () => {
      const response = await supertest(app).delete(`/api/query/${validID}`);
      expect(response.body.message).toContain("Not authorized!!");
    });

    test("queryId should be valid", async () => {
      const response = await supertest(app)
        .delete(`/api/query/1`)
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.body.error).toBe("Invalid ID");
    });

    test("queryId should exist", async () => {
      const response = await supertest(app)
        .delete(`/api/query/${invalidID}`)
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.body.message).toBe("query not found");
    });

    test("should delete the query", async () => {
      const response = await supertest(app)
        .delete(`/api/query/${validID}`)
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.body.message).toBe("Query deleted successfully!!");
    });
  });
});