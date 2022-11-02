import mongoose, { Schema } from 'mongoose';

const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  photoUrl: String,
  options: [String],
  areas: [String],
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const QuestionModel = mongoose.model('Question', QuestionSchema);

QuestionSchema.index({
  title: 'text', areas: 'text', options: 'text', answers: 'text',
});

export default QuestionModel;
