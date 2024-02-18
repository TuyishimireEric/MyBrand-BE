import mongoose from "mongoose";

export enum QueryStatus {
    Read = "read",
    UnRead = "unRead",
    Hidden = "hidden"
}

export interface QueryInterface {
  id: string;
  name: string;
  email: string;
  description: string;
  status: QueryStatus
}

const querySchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['read', 'unread', 'hidden'],
        default: 'unread'
      }
  },
  { timestamps: true }
);

export default mongoose.model("Query", querySchema);
