import mongoose from "mongoose";

export interface BlogInterface {
  id: string;
  title: string;
  image: string;
  createdBy: string;
  description: string;
}

const blogSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
