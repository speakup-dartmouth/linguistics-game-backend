import Post from '../models/post_model';

export async function createPost(postFields) {
  // await creating a post
  const post = new Post();
  post.title = postFields.title;
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
export async function getPosts() {
  // await finding posts
  const posts = await Post.find();
  // return posts
  return posts;
}
export async function getPost(id) {
  // await finding one post
  const post = await Post.findById(id);
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
