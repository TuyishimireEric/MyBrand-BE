import mongoose from "mongoose";
import app from "../src/index";
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
   const DBUrl = "mongodb+srv://tuyishimireericc:D7EQDiK4fBnYU91p@mybrandtest.sakyzeg.mongodb.net/?retryWrites=true&w=majority&appName=myBrandTest";
    await mongoose.connect(DBUrl);

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

 }, 120000);

 afterAll(async () => {
    await mongoose.connection.close();
 });
};

it("/api/* for 404", async () => {
   const response = await supertest(app).get("/api/*");
   expect(response.statusCode).toBe(404);
});