/// <reference type="node">

import mongoose from "mongoose";

// Create the schema (Model) for the "users" data collection
const UserSchema: mongoose.Schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  picture: {
    type: String,
    required: false,
  },
});

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  name: string;
  email: string;
  picture: string;
}

// Export constant "User" as a mongoose model created using the UserSchema with the name "users"
export default mongoose.model<IUser>("users", UserSchema);
