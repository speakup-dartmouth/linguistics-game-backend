import mongoose, { Schema } from 'mongoose';

const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  photoUrl: String,
  options: [{
    type: String,
    index: true,
  }],
  categories: [{
    type: String,
    index: true,
  }],
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

QuestionSchema.index({
  title: 'text', description: 'text', categories: 'text', options: 'text',
});
QuestionSchema.index({
  title: 1, description: 1, categories: 1, options: 1,
});

const QuestionModel = mongoose.model('Question', QuestionSchema);

export default QuestionModel;
