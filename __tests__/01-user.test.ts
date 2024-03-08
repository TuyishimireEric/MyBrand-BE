import { test, expect } from "@jest/globals";
import supertest from "supertest";
import app from "../src/index";
import { setupTests, sharedState } from "./setupTests";

setupTests();

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

      expect(response.statusCode).toBe(400);
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
      sharedState.createdUser = payload.email;
      expect(response.body.message).toContain("Signed in successfully!!");
    });
  });
  describe("Login a user", () => {
    test("login with an invalid email", async () => {
      const payload: {
        email: string;
        password: string;
      } = {
        email: "test.com",
        password: "Test@123"
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
        email: "mutabazi8@gmail.com",
        password: "Eric@120",
      };
      const response = await supertest(app)
        .post(`/api/users/login`)
        .send(payload);

      expect(response.body.message).toContain("Invalid email or password ...");
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
        email: "test@gmail.com",
        password: "Test@123"
      };
      const response = await supertest(app)
        .post(`/api/users/login`)
        .send(payload);
      sharedState.token = response.body.data;
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
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.body.error).toContain("must be a valid email");
    });

    test("Search only existing user", async () => {
      const userEmail: string = invalidEmail;
      const response = await supertest(app)
        .get(`/api/users/find/`)
        .send({
          email: userEmail,
        })
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.body.message).toContain("User not found!!");
    });

    test("Search a user with a existing email", async () => {
      const userEmail: string = "mutabazi8@gmail.com";
      const response = await supertest(app)
        .get(`/api/users/find/`)
        .send({
          email: userEmail,
        })
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.body.message).toContain("User found successfully!!");
    });
  });

  describe("delete a user", () => {

    test("delete  with a invalid userId", async () => {
      const response = await supertest(app)
        .delete(`/api/users/123}`)
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.body.error).toContain("Invalid ID");
    });

    test("delete only existing user", async () => {
      const invalidID = "65d4bd006a24502c2896f4a3";
      const response = await supertest(app)
        .delete(`/api/users/${invalidID}`)
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.body.message).toContain("User not found!!");
      expect(response.body.error).toBeNull();
    });

    test("delete user", async () => {
      const findUser = await supertest(app)
        .get("/api/users/find")
        .send({
          email: sharedState.createdUser,
        })
        .set("Authorization", `Bearer ${sharedState.token}`);

      const response = await supertest(app)
        .delete(`/api/users/${findUser.body.data._id}`)
        .set("Authorization", `Bearer ${sharedState.token}`);

      expect(response.body.message).toContain("User deleted successfully!!");
      expect(response.body.error).toBeNull();
    });
  });
});