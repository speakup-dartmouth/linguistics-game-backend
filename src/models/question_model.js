import mongoose, { Schema } from 'mongoose';

const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  options: [String],
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

Question.index({
  title: 'text', type: 'text', tags: 'text', recipe: 'text',
});
const QuestionModel = mongoose.model('Question', QuestionSchema);

export default QuestionModel;
