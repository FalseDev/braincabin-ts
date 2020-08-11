import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import passport from "passport";
import key from "./config/key";
// Bring in keys file from config to store credentials outside
const db: string = key.mongoURI;

// Bring in all the routes for the API requests
import auth from "./routes/api/auth";
import questions from "./routes/api/questions";
import profile from "./routes/api/profile";
import answers from "./routes/api/answers";

// Set mongoose to use latest non depricated components
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

// Connect to mongoDB server using mongoose
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch((err: any) => console.log(err));

// Instantiate the express app from class
const app = express();

// Use the bodyparser middleware to parse post data into an object called body as a prop in request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware for sessions and authentication
app.use(passport.initialize());
import jwt from "./config/passport-jwt";
jwt(passport);

// Use all the API routes in the express app to handle requests
app.use("/api/auth", auth);
app.use("/api/questions", questions);
app.use("/api/profile", profile);
app.use("/api/answers", answers);

// Set the value for serving port as an environment variable or 5000 when not found
const port = process.env.PORT || 5000;

// Start the app and print a message to console using callbacks
app.listen(port, () => console.log(`Express server running at port ${port}`));
