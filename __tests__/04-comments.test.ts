import { test, expect } from "@jest/globals";
import supertest from "supertest";
import app from "../src/index";
import { setupTests, sharedState } from "./setupTests";

setupTests();

describe(`
    ---------------------------------- 
    COMMENTS
    ----------------------------------`, () => {
  const invalidID = "65dca38f42ec28cfbc7408ff";
  let validID: string = "";
  let validBlogId: string = "";

  describe("Create a comment", () => {
    const payload: {
      commentedBy: string;
      description: string;
    } = {
      commentedBy: "Paul",
      description: "Paul's query",
    };

    it("the status code should be 200", async () => {
      const response = await supertest(app).get("/api/blogs");
      expect(response.statusCode).toBe(200);
      validBlogId = response.body.data[0]._id;
    });

    test("All fields are valid", async () => {
      const response = await supertest(app).post(
        `/api/blogs/${validBlogId}/comments/`
      );

      expect(response.body.error).toContain("is required");
    });

    test("blog should be found", async () => {
      const response = await supertest(app)
        .post(`/api/blogs/${sharedState.inValidBlogId}/comments/`)
        .send(payload);
      expect(response.body.message).toContain("blog not found");
    });

    test("should create the comment", async () => {
      const response = await supertest(app)
        .post(`/api/blogs/${validBlogId}/comments/`)
        .send(payload);
      expect(response.body.data).toBeTruthy();
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Comment added successfully!");
      validID = response.body.data._id;
    });
  });

  describe("Getting all blog comments", () => {
    test("blog should be found", async () => {
      const response = await supertest(app).get(
        `/api/blogs/${invalidID}/comments/`
      );

      expect(response.statusCode).toBe(404);
    });

    it("the comment should be found", async () => {
      const response = await supertest(app).get(
        `/api/blogs/${validBlogId}/comments/`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.error).toBeNull();
      expect(response.body.data).toHaveLength;
    });
  });

  describe("Getting a comment", () => {
    it("URL must have a valid blog id", async () => {
      const response = await supertest(app).get(
        `/api/blogs/${validBlogId}/comments/123`
      );

      expect(response.body.error).toContain("Invalid ID");
      expect(response.status).toBe(404);
    });

    test("blog should be found", async () => {
      const response = await supertest(app).get(
        `/api/blogs/${sharedState.inValidBlogId}/comments/${validID}`
      );
      expect(response.body.message).toContain("Blog not found");
    });

    it("should return the comment", async () => {
      const response = await supertest(app).get(
        `/api/blogs/${validBlogId}/comments/${validID}`
      );

      expect(response.body.error).toBeNull();
      expect(response.body.data).toBeTruthy();
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Update a comment", () => {
    const payload: {
      visible: boolean;
    } = {
      visible: false,
    };

    test("user must be authorized to update a comment", async () => {
      const response = await supertest(app)
        .patch(`/api/blogs/${validBlogId}/comments/${validID}`)
        .send(payload);

      expect(response.body.message).toBe("Not authorized!!");
      expect(response.statusCode).toBe(403);
    });

    test("All fields are valid", async () => {
      const response = await supertest(app)
        .patch(`/api/blogs/${validBlogId}/comments/${validID}`)
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.body.error).toContain("is required");
    });

    test("blog should be found", async () => {
      const response = await supertest(app)
        .patch(`/api/blogs/${sharedState.inValidBlogId}/comments/${validID}`)
        .set("Authorization", `Bearer ${sharedState.token}`)
        .send(payload);
      expect(response.body.message).toContain("Blog not found");
    });

    test("should update the comment", async () => {
      const response = await supertest(app)
        .patch(`/api/blogs/${validBlogId}/comments/${validID}`)
        .set("Authorization", `Bearer ${sharedState.token}`)
        .send(payload);
      expect(response.body.data).toBeTruthy();
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Comment updated successfully!");
    });
  });

  describe("Delete a comment", () => {
    test("user should be authorized ", async () => {
      const response = await supertest(app).delete(`/api/blogs/${validBlogId}/comments/${validID}`);

      expect(response.body.message).toBe("Not authorized!!");
      expect(response.statusCode).toBe(403);
    });
  
      test("blog should be found", async () => {
        const response = await supertest(app)
          .delete(`/api/blogs/${sharedState.inValidBlogId}/comments/${validID}`)
          .set("Authorization", `Bearer ${sharedState.token}`)

        expect(response.body.message).toContain("Blog not found");
      });
  
      test("should delete the comment", async () => {
        const response = await supertest(app)
          .delete(`/api/blogs/${validBlogId}/comments/${validID}`)
          .set("Authorization", `Bearer ${sharedState.token}`)
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain("Comment deleted successfully!");
      });
  });
});
