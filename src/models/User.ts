import mongoose from "mongoose";

export interface userInterface {
    userId: string,
    userName: string,
    email: string,
    password: string,
    role: string
}

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user",
        enum: ['user', 'admin']
    }
},
{
    timestamps: true
})

export default mongoose.model("User", userSchema);