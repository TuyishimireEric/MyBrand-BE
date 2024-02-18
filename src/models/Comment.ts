import mongoose from "mongoose";

export interface commentInterface {
    blodId: string,
    commentedBy: string,
    description: string,
    visible: boolean
}

const CommentSchema = new mongoose.Schema({
    blogId: {
        type: String,
        required: true,
        ref: "Blog"
    },
    commentedBy: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    visible: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
}
)

export default mongoose.model("Comment", CommentSchema);