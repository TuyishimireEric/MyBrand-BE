import { test, expect } from "@jest/globals";
import supertest from "supertest";
import app from "../src/index";
import path from "path";
import { setupTests, sharedState } from "./setupTests";

setupTests();

describe(`
  ---------------------------------- 
  Blogs 
  ----------------------------------`, () => {
  const invalidID = "12345";
  let validID: string;

  describe("Getting all Blogs", () => {
    it("the status code should be 200", async () => {
      const response = await supertest(app).get("/api/blogs");
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toBeNull();
      expect(response.body.data).toHaveLength;
      sharedState.validBlogId = response.body.data[0]._id;
    });
  });

  describe("Create a Blog", () => {
    const payload: {
      title: string;
      description: string;
    } = {
      title: "new blog",
      description: "new blog description",
    };
    const filePath = path.resolve(__dirname, "./typescript.jpeg");

    test("user must be authorized to create a blog", async () => {
      const response = await supertest(app)
        .post(`/api/blogs/`)
        .attach("image", filePath)
        .field("title", payload.title)
        .field("description", payload.description);

      expect(response.body.message).toBe("Not authorized!!");
      expect(response.statusCode).toBe(403);
    });

    test("All fields are valid", async () => {
      const response = await supertest(app)
        .post(`/api/blogs/`)
        .set("Authorization", `Bearer ${sharedState.token}`)
        .attach("image", filePath);

      expect(response.body.error).toContain("is required");
    });

    test("should create the blog", async () => {
      const response = await supertest(app)
        .post(`/api/blogs/`)
        .set("Authorization", `Bearer ${sharedState.token}`)
        .attach("image", filePath)
        .field("title", payload.title)
        .field("description", payload.description);
      expect(response.body.data).toBeTruthy();
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Blog created successfully!!");
      validID = response.body.data._id;
    });
  });

  describe("Getting a Blog", () => {
    it("URL must have a valid blog id", async () => {
      const response = await supertest(app).get(`/api/blogs/${invalidID}`);
      expect(response.body.message).toContain("Blog doesn't exist!");
      expect(response.status).toBe(404);
    });
    it("should return the blog", async () => {
      const response = await supertest(app).get(`/api/blogs/${validID}`);
      expect(response.body.error).toBeNull();
      expect(response.body.data).toBeTruthy();
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Update a Blog", () => {
    const payload: {
      title: string;
      description: string;
    } = {
      title: "Updated title",
      description: "updated description",
    };
    const filePath = path.resolve(__dirname, "./typescript.jpeg");

    test("URL must have a valid blog id", async () => {
      const response = await supertest(app).get(`/api/blogs/${invalidID}`);
      expect(response.body.message).toContain("Blog doesn't exist!");
    });

    test("user must be authorized to update the blog", async () => {
      const response = await supertest(app)
        .patch(`/api/blogs/${validID}`)
        .attach("image", filePath)
        .field("title", payload.title)
        .field("description", payload.description);

      expect(response.body.message).toBe("Not authorized!!");
      expect(response.statusCode).toBe(403);
    });

    it("should update the blog", async () => {
      const response = await supertest(app)
        .patch(`/api/blogs/${validID}`)
        .set("Authorization", `Bearer ${sharedState.token}`)
        .attach("image", filePath)
        .field("title", payload.title)
        .field("description", payload.description);
      expect(response.body.data).toBeTruthy();
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Blog updated successfully!!");
    });
  });

  describe("Delete a Blog", () => {
    test("user must be authorized to delete the blog", async () => {
      const response = await supertest(app).delete(`/api/blogs/${validID}`);

      expect(response.body.message).toBe("Not authorized!!");
      expect(response.statusCode).toBe(403);
    });

    test("URL must have a valid blog id", async () => {
      const response = await supertest(app)
        .delete(`/api/blogs/${invalidID}`)
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.body.error).toBe("Invalid ID");
      expect(response.status).toBe(404);
    });

    test("blog should be deleted", async () => {
      const response = await supertest(app)
        .delete(`/api/blogs/${validID}`)
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.body.error).toBeNull();
      expect(response.body.message).toContain("Blog deleted successfully!!");
    });
  });
});