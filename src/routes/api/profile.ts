import { Router } from "express";
import passport from "passport";

// Load models
import Profile from "../../models/Profile";

// Load Validator for profile
import profileInputValidator from "../../validations/profile";
import { IUser } from "../../models/User";

const profileRoute = Router();

profileRoute.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = <IUser>req.user;
    Profile.findOne({ user: user.id })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          return res
            .status(400)
            .json({ profile: "No profile found for this user" });
        }
        res.json(profile);
      });
  }
);

profileRoute.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = profileInputValidator(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const user = <IUser>req.user;
    Profile.findOne({ user: user.id }).then((profile) => {
      if (profile) {
        Profile.findOneAndUpdate(
          { user: user.id },
          {
            $set: {
              status: req.body.status,
              birthdate: new Date(req.body.birthdate),
              institute: req.body.institute,
            },
          },
          { new: true }
        )
          .populate("user", ["name", "username"])
          .then((profile) => res.json(profile));
      } else {
        new Profile({
          status: req.body.status,
          birthdate: new Date(req.body.birthdate),
          institute: req.body.institute,
        })
          .save()
          .then((profile) => {
            res.json(profile);
          });
      }
    });
  }
);

profileRoute.get("/all", (req, res) => {
  req.body.from = req.body.from ? req.body.from : 1;
  req.body.to = req.body.to ? req.body.to : 10;

  Profile.find()
    .populate("user", ["name", "username"])
    .then((profiles) => {
      if (profiles.length === 0) {
        return res.status(400).json({ error: "There are no profiles yet." });
      }
      res.json(profiles.slice(req.body.from - 1, req.body.to));
    });
});

export default profileRoute;
