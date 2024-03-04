import { test, it, describe, expect, beforeAll, afterAll } from "@jest/globals";
import supertest from "supertest";
import mongoose from "mongoose";
import app from "../src/index";
import dotenv from "dotenv";
import path from "path";
import { DBUrl } from "../src/index";

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(DBUrl);
}, 120000);

afterAll(async () => {
  await mongoose.connection.close();
});

let token = "none";
let createdUser: string;

describe("API TEST ", () => {
  let validBlogId: string = "";
  let inValidBlogId: string = "65d33d76a539804b38c68dee";

  describe(`
  ---------------------------------- 
  User 
  ----------------------------------`, () => {
    describe("Create a user", () => {
      test("The password should be strong", async () => {
        const payload: {
          userName: string;
          email: string;
          password: string;
        } = {
          userName: "Paul",
          email: "mutabazi@gmail.com",
          password: "123a",
        };
        const response = await supertest(app)
          .post(`/api/users/signup`)
          .send(payload);

        expect(response.statusCode).toBe(404);
      });

      test("userName should be valid", async () => {
        const payload: {
          userName: string;
          email: string;
          password: string;
        } = {
          userName: "Pa",
          email: "mutabazi@gmail.com",
          password: "123",
        };
        const response = await supertest(app)
          .post(`/api/users/signup`)
          .send(payload);
        expect(response.body.error).toContain(
          "length must be at least 3 characters long"
        );
      });
      test("The email should be valid", async () => {
        const payload: {
          userName: string;
          email: string;
          password: string;
        } = {
          userName: "Paul",
          email: "mutabazi@gmail",
          password: "123",
        };
        const response = await supertest(app)
          .post(`/api/users/signup`)
          .send(payload);
        expect(response.body.error).toContain("must be a valid email");
      });
      test("use email that is not used", async () => {
        const payload: {
          userName: string;
          email: string;
          password: string;
        } = {
          userName: "Paul",
          email: "mutabazi@gmail.com",
          password: "Eric@123",
        };
        const response = await supertest(app)
          .post(`/api/users/signup`)
          .send(payload);
        expect(response.body.message).toContain("User already exist");
      });
      test("Create a user", async () => {
        const payload: {
          userName: string;
          email: string;
          password: string;
        } = {
          userName: "Paul",
          email: "mutabazi8@gmail.com",
          password: "Eric@123",
        };
        const response = await supertest(app)
          .post(`/api/users/signup`)
          .send(payload);
        createdUser = payload.email;
        expect(response.body.message).toContain("Signed in successfully!!");
      });
    });
    describe("Login a user", () => {
      test("login with a valid email", async () => {
        const payload: {
          email: string;
          password: string;
        } = {
          email: "ericMucyogmail.com",
          password: "Eric@124",
        };
        const response = await supertest(app)
          .post(`/api/users/login`)
          .send(payload);

        expect(response.body.error).toContain("must be a valid email");
      });

      test("email and password should be collect", async () => {
        const payload: {
          email: string;
          password: string;
        } = {
          email: "ericMucyo@gmail.com",
          password: "Eric@120",
        };
        const response = await supertest(app)
          .post(`/api/users/login`)
          .send(payload);

        expect(response.body.message).toContain(
          "Invalid email or password ..."
        );
        expect(response.statusCode).toBe(400);
      });

      test("email should exist in our database", async () => {
        const payload: {
          email: string;
          password: string;
        } = {
          email: "ericMuco@gmail.com",
          password: "Eric@124",
        };
        const response = await supertest(app)
          .post(`/api/users/login`)
          .send(payload);
        expect(response.body.message).toContain("User not found");
        expect(response.statusCode).toBe(400);
      });

      test("Login", async () => {
        const payload: {
          email: string;
          password: string;
        } = {
          email: "tuyi@gmail.com",
          password: "Eric@124",
        };
        const response = await supertest(app)
          .post(`/api/users/login`)
          .send(payload);
        token = response.body.data;
        expect(response.body.message).toContain("Signed in successfully!!");
      });
    });
    describe("Search user", () => {
      const invalidEmail = "maha@gmail.com";

      test("Search only with valid email", async () => {
        const response = await supertest(app)
          .get(`/api/users/find/`)
          .send({
            email: "mh.com",
          })
          .set("Authorization", `Bearer ${token}`);

        expect(response.body.error).toContain("must be a valid email");
      });

      test("Search only existing user", async () => {
        const userEmail: string = invalidEmail;
        const response = await supertest(app)
          .get(`/api/users/find/`)
          .send({
            email: userEmail,
          })
          .set("Authorization", `Bearer ${token}`);

        expect(response.body.message).toContain("User not found!!");
      });

      test("Search a user with a existing email", async () => {
        const userEmail: string = "tuyi@gmail.com";
        const response = await supertest(app)
          .get(`/api/users/find/`)
          .send({
            email: userEmail,
          })
          .set("Authorization", `Bearer ${token}`);

        expect(response.body.message).toContain("User found successfully!!");
      });
    });

    describe("delete a user", () => {
      const invalidID = "1234";

      test("delete  with a invalid userId", async () => {
        const userId: string = invalidID;
        const response = await supertest(app)
          .delete(`/api/users/${userId}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.body.error).toContain("Invalid ID");
      });

      test("delete only existing user", async () => {
        const invalidID = "65d4bd006a24502c2896f4a3";
        const response = await supertest(app)
          .delete(`/api/users/${invalidID}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.body.message).toContain("User not found!!");
        expect(response.body.error).toBeNull();
      });

      test("delete user", async () => {
        const findUser = await supertest(app)
          .get("/api/users/find")
          .send({
            email: createdUser,
          })
          .set("Authorization", `Bearer ${token}`);

        const response = await supertest(app)
          .delete(`/api/users/${findUser.body.data._id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.body.message).toContain("User deleted successfully!!");
        expect(response.body.error).toBeNull();
      });
    });
  });

  describe(`
  ---------------------------------- 
  Blogs 
  ----------------------------------`, () => {
    const invalidID = "12345";
    let validID: string;

    describe("Getting all Blogs", () => {
      it("/api/* for 404", async () => {
        const response = await supertest(app).get("/api/*");
        expect(response.statusCode).toBe(404);
      });
      it("the status code should be 200", async () => {
        const response = await supertest(app).get("/api/blogs");
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBeNull();
        expect(response.body.data).toHaveLength;
        validBlogId = response.body.data[0]._id;
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
          .set("Authorization", `Bearer ${token}`)
          .attach("image", filePath);

        expect(response.body.error).toContain("is required");
      });

      test("should create the blog", async () => {
        const response = await supertest(app)
          .post(`/api/blogs/`)
          .set("Authorization", `Bearer ${token}`)
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
          .set("Authorization", `Bearer ${token}`)
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
          .set("Authorization", `Bearer ${token}`);

        expect(response.body.error).toBe("Invalid ID");
        expect(response.status).toBe(404);
      });

      test("blog should be deleted", async () => {
        const response = await supertest(app)
          .delete(`/api/blogs/${validID}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.body.error).toBeNull();
        expect(response.body.message).toContain("Blog deleted successfully!!");
      });
    });
  });

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
          .set("Authorization", `Bearer ${token}`);
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
          .set("Authorization", `Bearer ${token}`);

        expect(response.body.error).toContain("Invalid ID");
        expect(response.status).toBe(404);
      });

      it("the query should exist", async () => {
        const response = await supertest(app)
          .get(`/api/query/${invalidID}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.body.message).toBe("query not found");
      });

      it("should return the query", async () => {
        const response = await supertest(app)
          .get(`/api/query/${validID}`)
          .set("Authorization", `Bearer ${token}`);

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
          .set("Authorization", `Bearer ${token}`);

        expect(response.body.error).toContain("is required");
      });

      test("queryId should be valid", async () => {
        const response = await supertest(app)
          .patch(`/api/query/123`)
          .set("Authorization", `Bearer ${token}`)
          .send(payload);

        expect(response.body.error).toBe("Invalid ID");
      });

      test("queryId should exist", async () => {
        const response = await supertest(app)
          .patch(`/api/query/${invalidID}`)
          .set("Authorization", `Bearer ${token}`)
          .send(payload);

        expect(response.body.message).toBe("query not found");
      });

      test("should update the query", async () => {
        const response = await supertest(app)
          .patch(`/api/query/${validID}`)
          .set("Authorization", `Bearer ${token}`)
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
          .set("Authorization", `Bearer ${token}`);

        expect(response.body.error).toBe("Invalid ID");
      });

      test("queryId should exist", async () => {
        const response = await supertest(app)
          .delete(`/api/query/${invalidID}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.body.message).toBe("query not found");
      });

      test("should delete the query", async () => {
        const response = await supertest(app)
          .delete(`/api/query/${validID}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.body.message).toBe("Query deleted successfully!!");
      });
    });
  });
});
