import { test, expect } from "@jest/globals";
import supertest from "supertest";
import app from "../src/index";
import { setupTests, sharedState } from "./setupTests";

setupTests();

describe(`
    ---------------------------------- 
    LIKES
    ----------------------------------`, () => {
  const invalidID = "65dca38f42ec28cfbc7408ff";
  let validID: string = "";
  let validBlogId: string = "";

  describe("Like or unLike", () => {
    const payload: {
      likedBy: string;
    } = {
      likedBy: "Paul",
    };

    it("the status code should be 200", async () => {
      const response = await supertest(app).get("/api/blogs");
      expect(response.statusCode).toBe(200);
      validBlogId = response.body.data[0]._id;
    });


    test("blog should be found", async () => {
      const response = await supertest(app)
        .post(`/api/blogs/${sharedState.inValidBlogId}/likes/`)
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.body.message).toContain("blog not found");
    });

    test("should like", async () => {
      const response = await supertest(app)
        .post(`/api/blogs/${validBlogId}/likes/`)
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Liked");
    });

    test("should unlike", async () => {
        const response = await supertest(app)
          .post(`/api/blogs/${validBlogId}/likes/`)
          .set("Authorization", `Bearer ${sharedState.token}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("unLiked");
      });
  });

  describe("Getting all blog likes", () => {
    test("blog should be found", async () => {
      const response = await supertest(app).get(
        `/api/blogs/${invalidID}/likes/`
      );

      expect(response.statusCode).toBe(404);
    });

    it("the likes should be found", async () => {
      const response = await supertest(app).get(
        `/api/blogs/${validBlogId}/likes/`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.error).toBeNull();
    });
  });
});