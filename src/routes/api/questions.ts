import express from "express";
import passport from "passport";
const questionsRouter = express.Router();
import Question, { IQuestion } from "../../models/Question";
import User, { IUser } from "../../models/User";
import questionInputValidator from "../../validations/question";
import vote, { IactOn } from "../../controllers/votes";

questionsRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req: any, res: express.Response) => {
    const { errors, isValid } = questionInputValidator(req.body);
    req.user = <IUser>req.user;
    if (!isValid) {
      return res.status(400).json(errors);
    }

    new Question({
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      subject: req.body.subject,
      level: req.body.level,
      user: req.user.id,
      answerCount: 0,
      upvoteCount: 0,
      downvoteCount: 0,
    })
      .save()
      .then((question) => {
        User.findById(req.user.id).then((_user) => {
          res.json(question);
        });
      });
  }
);

questionsRouter.post(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = questionInputValidator(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const user = <IUser>req.user;

    Question.findOneAndUpdate(
      { user: user.id, _id: req.body.id },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          tags: req.body.tags,
          subject: req.body.subject,
          level: req.body.level,
          user: req.user!,
        },
      },
      { new: true }
    )
      .populate("user", ["username", "name"])
      .then((question) => {
        if (!question) {
          return res.status(404).json({ errors: "Question not found" });
        }
        res.json(question);
      });
  }
);

questionsRouter.get("/all", (req, res) => {
  req.body.from = req.body.from ? req.body.from : 1;
  req.body.to = req.body.to ? req.body.to : 10;

  Question.find()
    .populate("user", ["name", "username"])
    .then((questions) => {
      if (questions.length === 0) {
        return res.status(400).json({ error: "There are no questions yet." });
      }
      res.json(questions.slice(req.body.from - 1, req.body.to));
    });
});

questionsRouter.get("/id", (req, res) => {
  if (!req.body.id)
    return res.status(400).json({ id: "ID of the question is required" });
  Question.findOne({ _id: req.body.id })
    .then((question) => {
      if (question) return res.json(question);
      return res.status(404).json({ notFound: "The question was not found" });
    })
    .catch((err) => {
      res.json(err);
    });
});

questionsRouter.get("/tags", (req, res) => {
  Question.find({ tags: { $in: req.body.tags } }).then((questions) => {
    res.json(questions);
  });
});

questionsRouter.post(
  "/upvote",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    vote(req, res, Question, "upvote");
  }
);

questionsRouter.post(
  "/downvote",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    vote(req, res, Question, "downvote");
  }
);

/*
questionsRouter.post(
  "/upvote",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = <IUser>req.user;
    Question.findById(req.body.id).then((question) => {
      if (!question) {
        return res.status(400).json({ error: "Question not found" });
      } // Send error if theres no question with with id
      if (req.body.upvote) {
        if (
          question.upvotes.filter((upvote) => user.id === upvote._id.toString())
            .length === 0
        ) {
          if (
            question.downvotes.filter(
              (downvote) => user.id === downvote._id.toString()
            ).length === 1
          ) {
            const vote_index = question.downvotes
              .map((vote) => vote._id.toString())
              .indexOf(user._id.toString());
            question.downvotes.splice(vote_index);
          }
          question.upvotes.push(user._id);
          question.save().then((_question) => {
            return res.json({ upvoted: true });
          });
        } else return res.json({ error: "Already upvoted" });
      } else {
        if (
          question.upvotes.filter((upvote) => user.id === upvote._id.toString())
            .length === 1
        ) {
          const vote_index = question.upvotes
            .map((vote) => vote._id.toString())
            .indexOf(user._id.toString());
          question.upvotes.splice(vote_index);
          question.save();
          return res.json(question);
        } else return res.json({ error: "Not upvoted yet" });
      }
    });
  }
);

questionsRouter.post(
  "/downvote",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = <IUser>req.user;
    Question.findById(req.body.id).then((question) => {
      if (!question) {
        return res.status(400).json({ error: "Question not found" });
      } // Send error if theres no question with with id
      if (req.body.downvote) {
        if (
          question.downvotes.filter(
            (downvote) => user.id === downvote._id.toString()
          ).length === 0
        ) {
          if (
            question.upvotes.filter(
              (upvote) => user.id === upvote._id.toString()
            ).length === 1
          ) {
            const vote_index = question.upvotes
              .map((vote) => vote._id.toString())
              .indexOf(user._id.toString());
            question.upvotes.splice(vote_index);
          }
          question.downvotes.push(user._id);
          question.save().then((_question) => {
            return res.json({ downvoted: true });
          });
        } else return res.json({ error: "Already downvoted" });
      } else {
        if (
          question.downvotes.filter(
            (downvote) => user.id === downvote._id.toString()
          ).length === 1
        ) {
          const vote_index = question.downvotes
            .map((vote) => vote._id.toString())
            .indexOf(user._id.toString());
          question.downvotes.splice(vote_index);
          question.save();
          return res.json(question);
        } else return res.json({ error: "Not downvoted yet" });
      }
    });
  }
);
*/
export default questionsRouter;
