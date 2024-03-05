import mongoose from "mongoose";
import app, { DBUrl } from "../src/index";
import supertest from "supertest";

interface IsharedState {
   token: string,
   createdUser: string,
   validBlogId: string,
   inValidBlogId: string
}

export const sharedState:IsharedState = {
   token: "none",
   createdUser: "",
   validBlogId: "",
   inValidBlogId: "65d33d76a539804b38c60000",
};

export const setupTests = () => {
 beforeAll(async () => {
    await mongoose.connect(DBUrl);

    console.log("DBUrl", DBUrl);

    const payload: {
      email: string;
      password: string;
    } = {
      email: process.env.ADMIN_EMAIL || "tuyishimireericc@gmail.com",
      password: process.env.ADMIN_PASSWORD || "Eric@196",
    };
    const response = await supertest(app)
      .post(`/api/users/login`)
      .send(payload);
    sharedState.token = response.body.data;

 }, 120000);

 afterAll(async () => {
    await mongoose.connection.close();
 });
};

it("/api/* for 404", async () => {
   const response = await supertest(app).get("/api/*");
   expect(response.statusCode).toBe(404);
});