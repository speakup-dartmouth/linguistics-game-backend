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
  post.images = postFields.images;
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
  if ('search_term' in query) {
    const posts = await Post.find({ $text: { $search: query.search_term } }).populate('author', 'username profilePicture').sort({ createdAt: -1 });
    return posts;
  }

  if ('user' in query) {
    const user = await User.findById(query.user);
    if (!user) {
      throw new Error('user not found');
    }
    // get posts from user's home (posts that user is following)
    if ('home' in query) {
      // get all posts from following
      if (query.home === 'all') {
        const posts = await Post.find({ author: { $in: user.following } } ).populate('author', 'username profilePicture').sort({ createdAt: -1 });
        return posts;
      // get only unviewed posts
      } else if (query.home === 'unviewed') { 
        const posts = await Post.find({ author: { $in: user.following }, _id: { $nin: user.viewedPosts } }).populate('author', 'username profilePicture').sort({ createdAt: -1 });
        return posts;
      } else {
        throw new Error('please provide a valid home query value');
      }
    } else if ('discovery' in query) {
      // return posts sorted by most liked that are not made by the user
      if (query.discovery === 'hot') {
        const posts = await Post.find(({ author: { $nin: user.id }}));
        posts.sort((a, b) => b.likes.length - a.likes.length);
        return posts;
      } else if (query.discovery === 'recommended') {
        const posts = await Post.find({ author: { $in: user.following }, author: { $ne: user }, _id: { $nin: user.viewedPosts } });
        posts.sort((a, b) => 
          {
            aScore = 0;
            
            b.likes.length - a.likes.length;
          });
        return posts;
      }
    // get user's posts
    } else {
      const posts = await Post.find({ author: { $in: user.id }}).populate('author', 'username profilePicture').sort({ createdAt: -1 });
      return posts;
    }
  }

  // return all posts
  const posts = await Post.find().populate('author', 'username profilePicture');
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
export async function updatePost(id, query, postFields) {
  try {
    const post = await Post.findByIdAndUpdate(id, postFields, { returnDocument: 'after' });

    // await updating a post by id
    if ('update_type' in query) {
      if (query.update_type == 'like') {
        const user = await User.findById(query.user);
        const titleWords = post.title.split(' ');
        titleWords.forEach((word) => {
          if (!user.termFrequency.title.has(word)) {
            user.termFrequency.title.set(word, 0);
          }
          user.termFrequency.title.set(word, user.termFrequency.title.get(word) + 1);
          user.termFrequency.titleCount += 1;
        });

        if (post.type != null) {
          const typeWords = post.title.split(' ');
          typeWords.forEach((word) => {
            if (!user.termFrequency.type.has(word)) {
              user.termFrequency.type.set(word, 0);
            }
            user.termFrequency.type.set(word, user.termFrequency.type.get(word) + 1);
            user.termFrequency.typeCount += 1;
          });
        }

        if (post.recipe != null) {
          post.recipe.ingredients.forEach((ingredient) => {
            if (!user.termFrequency.ingredients.has(ingredient.ingredientName)) {
              user.termFrequency.ingredients.set(ingredient.ingredientName, 0);
            }
            user.termFrequency.ingredients.set(ingredient.ingredientName, 
              user.termFrequency.ingredients.get(ingredient.ingredientName) + 1);
            user.termFrequency.ingredientsCount += 1;
          });
        }
        
        const difficulties = ['easy', 'medium', 'hard'];
        if (!user.termFrequency.difficulty.has(difficulties[post.difficulty - 1])) {
          user.termFrequency.difficulty.set(difficulties[post.difficulty - 1], 0);
        }
        user.termFrequency.difficulty.set(difficulties[post.difficulty - 1], user.termFrequency.difficulty.get(difficulties[post.difficulty - 1]) + 1);
        user.termFrequency.difficultyCount += 1;
        console.log(user);
        user.save();
      }
    }
    
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
