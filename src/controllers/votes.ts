import { IUser } from "../models/User";
import mongoose from "mongoose";

export interface IactOn extends mongoose.Document {
  upvotes: [{ _id: string }];
  downvotes: [{ _id: string }];
}

function vote(
  req: any,
  res: any,
  QorA: any, // Model to act on
  type: "upvote" | "downvote" // vote act mode on object
): void {
  const user = <IUser>req.user;
  if (type == "upvote") {
  }

  QorA.findById(req.body.id).then((actOn: any) => {
    if (!actOn) {
      return res.status(400).json({ error: "Not found" });
    } // Send error if theres no object with with id
    const addMode = type === "upvote" ? req.body.upvote : req.body.downvote; // addMode defines whether the request is to add vote
    const actVoteType = type === "upvote" ? actOn.upvotes : actOn.downvotes; // actVoteType references the type of votes being acted upon
    const complementaryVoteType =
      type === "downvote" ? actOn.upvotes : actOn.downvotes;

    if (addMode) {
      if (
        actVoteType.filter((vote: any) => user.id === vote._id.toString())
          .length === 0
      ) {
        if (
          complementaryVoteType.filter(
            (vote: any) => user.id === vote._id.toString()
          ).length === 1
        ) {
          const vote_index = complementaryVoteType
            .map((vote: any) => vote._id.toString())
            .indexOf(user._id.toString());
          complementaryVoteType.splice(vote_index);
        }
        actVoteType.push(user._id);
        actOn.save().then((_actOn: any) => {
          return res.json({ upvoted: true });
        });
      } else return res.json({ error: "Already voted" });
    } else {
      if (
        actVoteType.filter((vote: any) => user.id === vote._id.toString())
          .length === 1
      ) {
        const vote_index = actVoteType
          .map((vote: any) => vote._id.toString())
          .indexOf(user._id.toString());
        actVoteType.splice(vote_index);
        actOn.save();
        return res.json(actOn);
      } else return res.json({ error: "Not upvoted yet" });
    }
  });
}
export default vote;
