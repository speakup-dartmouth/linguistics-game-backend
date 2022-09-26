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

const QuestionModel = mongoose.model('Question', QuestionSchema);

QuestionSchema.index({
  title: 'text', type: 'text', tags: 'text', recipe: 'text',
});

export default QuestionModel;
