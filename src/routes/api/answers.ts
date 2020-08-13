import express from "express";
import passport from "passport";
import Answer from "../../models/Answer";
import Question from "../../models/Question";
import { IUser } from "../../models/User";
import vote from "../../controllers/votes";
import answerInputValidator from "../../validations/answer";
const answerRouter = express.Router();

answerRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = answerInputValidator(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    if (!req.body.id) {
      return res.status(400).json({ error: "No id provided" });
    }

    const user = <IUser>req.user;

    new Answer({
      answer: req.body.description,
      user: user.id,
      question: req.body.question,
      upvoteCount: 0,
      downvoteCount: 0,
      answers: 0,
    })
      .save()
      .then((answer) => {
        Question.findById(req.body.question).then((question) => {
          question!.answerCount++;
          question!.save().then((question) => {
            res.json({ answer, question });
          });
        });
      });
  }
);

answerRouter.post(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = <IUser>req.user;
    if (!req.body.id) {
      return res.status(400).json({ error: "No id provided" });
    }
    Answer.findById(req.body.id).then((answer) => {
      if (!answer) {
        return res
          .status(404)
          .json({ notFound: "Answer with specified id not found" });
      }
      if (answer.user.toString() !== user._id.toString()) {
        return res
          .status(403)
          .json({ notAuthorised: "You don't have access to edit this answer" });
      }
      answer.answer = req.body.description;
      answer.save().then((savedAnswer) => {
        res.json({ Updated: true, savedAnswer });
      });
    });
  }
);

answerRouter.post(
  "/upvote",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    vote(req, res, Answer, "upvote");
  }
);

answerRouter.post(
  "/downvote",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    vote(req, res, Answer, "downvote");
  }
);

export default answerRouter;
