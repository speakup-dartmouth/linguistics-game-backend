import mongoose, { Schema } from 'mongoose';

const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  photoUrl: String,
  options: [String],
  categories: [String],
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const QuestionModel = mongoose.model('Question', QuestionSchema);

QuestionSchema.index({
  title: 'text', categories: 'text', options: 'text', answers: 'text',
});

export default QuestionModel;
