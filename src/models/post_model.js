import mongoose, { Schema } from 'mongoose';

// create a PostSchema with a title field

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  tags: String,
  content: String,
  coverUrl: String,
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

// create PostModel class from schema
const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
