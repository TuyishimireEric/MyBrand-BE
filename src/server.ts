import app from "./index";
import mongoose from "mongoose";
import { DBUrl } from "./index";

mongoose
  .connect(DBUrl)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Start the server
app.listen(5000, () => {
  console.log("Server has started!");
});
