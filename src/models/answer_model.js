import mongoose, { Schema } from 'mongoose';

const AnswerSchema = new Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  recording: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const AnswerModel = mongoose.model('Answer', AnswerSchema);

export default AnswerModel;
