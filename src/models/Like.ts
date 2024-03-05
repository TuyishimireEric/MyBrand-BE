import mongoose from "mongoose";

export interface likeInterface {
    blogId: string,
    likedBy: string
}

const LikeSchema = new mongoose.Schema({
    blogId: {
        type: String,
        required: true,
        ref: "Blog"
    },
    likedBy: {
        type: String,
        default: "User",
    }
},
{
    timestamps: true
})

export default mongoose.model("Like", LikeSchema);