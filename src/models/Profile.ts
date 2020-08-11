import mongoose from "mongoose";
import { IUser } from "./User";

// Create Profile Schema
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  institute: {
    type: String,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

export interface IProfile extends mongoose.Document {
  user: IUser["_id"];
  institute: string;
  birthdate: Date;
  status: string;
}

export default mongoose.model<IProfile>("profile", ProfileSchema);

