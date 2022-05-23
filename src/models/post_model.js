import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: String,
  tags: [String],
  recipe: String,
  difficulty: Number,
  time: Number,
  featuredImage: String,
  images: [String],
  video: String,
  recipeURL: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

PostSchema.index({
  title: 'text', type: 'text', tags: 'text', author: 'text',
});
const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
