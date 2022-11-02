/* eslint-disable func-names */
import mongoose, { Schema } from 'mongoose';

const AnswerSchema = new Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  recordingURL: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  stance: { type: String },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

AnswerSchema.virtual('upvoteCount').get(function () {
  return this.upvotes.length;
});

AnswerSchema.virtual('downvoteCount').get(function () {
  return this.downvotes.length;
});

// to do!
AnswerSchema.methods.getUserVoteStatus = function (userID) {
  if (this.upvotes.some((upvote) => { return upvote.equals(userID); })) {
    return 1;
  } else if (this.downvotes.some((downvote) => { return downvote.equals(userID); })) {
    return -1;
  }
  return 0;
};

const AnswerModel = mongoose.model('Answer', AnswerSchema);

export default AnswerModel;
