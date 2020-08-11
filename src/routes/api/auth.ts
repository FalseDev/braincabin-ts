import { Router } from "express";
import { url } from "gravatar";
import { genSalt, hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import passport from "passport";

import User from "../../models/User";
import key from "../../config/key";

const secretKey = key.secretKey;

// Import validators
import validateRegisterInput from "../../validations/register";
import validateLoginInput from "../../validations/login";

// Create a new router to handle auth requests
const auth = Router();

// @Name      Register route
// @Usage     To create a new user
// @Access    Public

auth.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      // User email already exists
      return res.status(400).json({ email: "Email already exists" });
    }
    User.findOne({ username: req.body.username }).then((user) => {
      if (user) {
        return res.status(400).json({ email: "Username already taken" });
      }
    });
    // Create gravatar URL
    const picture = url(req.body.email, {
      s: "400",
      r: "pg",
      d: "mm",
    });

    // Create user object using Schema
    const newUser = new User({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      picture,
      password: req.body.password,
      // birthday:,
    });

    // Generate a hash salt and hash user password
    genSalt(10, (_err, salt) => {
      hash(newUser.password, salt, (err, hash) => {
        if (err) {
          throw err;
        } else {
          newUser.password = hash; // Set the user password as the newly created hash
          newUser
            .save() // Save the user into MongoDB, it's a mongoose method
            .then((user) => res.json(user)) // Return the info of the user as response(For now)
            .catch((err: Error) => console.log(err));
        }
      });
    });
  });
});

// @Name    Login route
// @Usage   Login an existing user
// @Access  Public

auth.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username }).then((user) => {
    if (!user) {
      // No such user found
      return res.status(404).json({ error: "User not found" });
    }
    compare(password, user.password) // Compare passwords with hash if user found
      .then((isMatch) => {
        if (isMatch) {
          // Passwords matched
          // Create payload
          const payload = { id: user.id, username: user.username };

          sign(payload, secretKey, { expiresIn: "7d" }, (_err, token) => {
            return res.json({ success: true, token: `Bearer ${token}` });
          });
        } else {
          res.status(400).json({ error: "Password does not match" });
        }
      });
  });
});

// Test
auth.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ success: true, user: req.user });
  }
);

// Export the auth router to use it's functions in main code
export default auth;
