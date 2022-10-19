import mongoose, { Schema } from 'mongoose';

const AnswerSchema = new Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  recording: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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

const AnswerModel = mongoose.model('Answer', AnswerSchema);

export default AnswerModel;
