import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: String,
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const CommentModel = mongoose.model('Comment', CommentSchema);

export default CommentModel;
