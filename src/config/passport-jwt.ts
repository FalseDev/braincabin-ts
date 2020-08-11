const jwtStategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
import User, { IUser } from "../models/User";
import keys from "./key";

// Create empty object to pass options
const opts: { jwtFromRequest?: any; secretOrKey?: string } = {};
// Use the bearer method in the header of request
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
// Pass in secret key for signing payload
opts.secretOrKey = keys.secretKey;

export default (passport: any) => {
  //  Create JWT strategy with the options
  passport.use(
    new jwtStategy(opts, (jwt_payload: any, done: Function) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user !== null) {
            user = <IUser>user;
            return done(null, user); // return user with request as req.user
          }
          return done(null, false); // Failed to find user
        })
        .catch((err) => console.log(err));
    })
  );
};
