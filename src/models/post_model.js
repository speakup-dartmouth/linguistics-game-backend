import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  tags: String,
  content: String,
  image: String,
  recipeURL: String,
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
