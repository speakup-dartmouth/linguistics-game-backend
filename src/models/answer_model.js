import mongoose, { Schema } from 'mongoose';

const AnswerSchema = new Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  recording: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

AnswerSchema.pre('save', async function beforeAnswerSave(next) {
  const answer = this; // get access to the answer model
  answer.upvotes = 0;
  answer.downvotes = 0;
  return next();
});

const AnswerModel = mongoose.model('Answer', AnswerSchema);

export default AnswerModel;
