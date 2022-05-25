import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema({
  content: { type: String, required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  type: String,
  tags: [String],
  recipe: String,
  difficulty: Number,
  time: Number,
  featuredImage: String,
  images: [String],
  recipeURL: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [CommentSchema],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

PostSchema.index({
  title: 'text', type: 'text', tags: 'text', recipe: 'text',
});
const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
