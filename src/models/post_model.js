import mongoose, { Schema } from 'mongoose';

const IngredientSchema = new Schema({
  ingredientName: String,
  quantity: mongoose.Types.Decimal128,
  unit: String,
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

const RecipeSchema = new Schema({
  steps: [String],
  ingredients: [IngredientSchema],
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

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
  recipe: RecipeSchema,
  difficulty: Number,
  time: Number,
  featuredImage: String,
  images: [String],
  recipeURL: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [CommentSchema],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likeCount: Number,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
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
