import mongoose from "mongoose";
import { IUser } from "./User";

const QuestionSchema: mongoose.Schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  title: {
    type: String,
    max: 30,
    required: true,
  },
  description: {
    type: String,
    min: 30,
    max: 500,
    required: true,
  },
  tags: {
    type: [String],
  },
  subject: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  upvotes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
  downvotes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
  answerCount: {
    type: Number,
  },
  downvoteCount: {
    type: Number,
  },
  upvoteCount: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export interface IQuestion extends mongoose.Document {
  user: IUser["_id"];
  title: string;
  description: string;
  tags: string[];
  level: string;
  subject: string;

  upvotes: IUser["_id"][];
  downvotes: IUser["_id"][];
  date: Date;

  answerCount: number;
  upvoteCount: number;
  downvoteCount: number;
}

export default mongoose.model<IQuestion>("questions", QuestionSchema);
