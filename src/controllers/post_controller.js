import Post from '../models/post_model';
import User from '../models/user_model';

export async function createPost(postFields) {
  // await creating a post
  const post = new Post();
  post.title = postFields.title;
  post.description = postFields.description;
  post.type = postFields.type;
  post.tags = postFields.tags;
  post.recipe = postFields.recipe;
  post.difficulty = postFields.difficulty;
  post.time = postFields.time;
  post.featuredImage = postFields.featuredImage;
  post.images = postFields.imagese;
  post.video = postFields.video;
  post.recipeUrl = postFields.recipeUrl;
  post.likes = postFields.likes;
  post.comments = postFields.comments;
  post.tags = postFields.tags;
  post.author = postFields.author;
  // return post
  try {
    const savedpost = await post.save();
    return savedpost;
  } catch (error) {
    throw new Error(`create post error: ${error}`);
  }
}
export async function getPosts(query) {
  if ('user' in query) {
    const user = await User.findById(query.user);
    if (!user) {
      throw new Error('user not found');
    }
    // get posts that the user is following
    if ('following' in query && query.following === 'true') {
      const posts = await Post.find({ author: { $in: user.following } }).populate('author', 'username profilePicture');
      return posts;
    // get user's posts
    } else {
      const posts = await Post.find({ author: { $in: user.id } }).populate('author', 'username profilePicture');
    }
  }
  
  const posts = await Post.find().populate('author', 'username profilePicture');
  // return posts
  return posts;
}
export async function getPost(id) {
  // await finding one post
  const post = await Post.findById(id).populate('author', 'username profilePicture');
  // return post
  if (!post) {
    throw new Error('post not found');
  }
  return post;
}
export async function deletePost(id) {
  // await deleting a post
  await Post.findByIdAndDelete(id);
  // return confirmation
  return { msg: `post ${id} deleted successfully.` };
}
export async function updatePost(id, postFields) {
  try {
    // await updating a post by id
    const post = await Post.findByIdAndUpdate(id, postFields, { returnDocument: 'after' });
    // return *updated* post
    return post;
  } catch (error) {
    throw new Error(`update post error: ${error}`);
  }
}

export async function findPosts(query) {
  try {
    const posts = await Post.find({ title: new RegExp(query) });
    return posts;
  } catch (error) {
    throw new Error(`failed to fetch posts, error: ${error}`);
  }
}
