import { Schema, model, Document } from "mongoose";
import { IUser } from "./User";
import { IQuestion } from "./Question";

const AnswerSchema = new Schema({
  answer: {
    type: String,
    min: 10,
    max: 1000,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "questions",
  },
  upvotes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
  downvotes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

export interface IAnswer extends Document {
  answer: string;
  user: IUser["_id"];
  question: IQuestion["_id"];
  upvotes: IUser["_id"][];
  downvotes: IUser["_id"][];
  date: Date;
}

export default model<IAnswer>("answers", AnswerSchema);
