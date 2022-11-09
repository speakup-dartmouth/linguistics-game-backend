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
  areas: [{
    type: String,
    index: true,
  }],
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

QuestionSchema.index({
  title: 'text', areas: 'text', options: 'text', description: 'text',
});
QuestionSchema.index({
  title: 1, areas: 1, options: 1, description: 1,
});

const QuestionModel = mongoose.model('Question', QuestionSchema);

export default QuestionModel;
