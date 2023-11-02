import mongoose, { Mongoose, Schema } from 'mongoose';

const SuggestionSchema = new Schema({
  prompt: {
    type: String,
    required: true,
  },
  stances: [{
    stance: String,
    color: String
  }],
  dateSubmitted: Date,
  icon: String,
  status: String,
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const SuggestionModel = mongoose.model('Suggestion', SuggestionSchema);

export default SuggestionModel;
