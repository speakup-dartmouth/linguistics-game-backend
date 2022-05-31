import Post from '../models/post_model';
import User from '../models/user_model';

export async function createPost(postFields, user, query) {
  if (!('key' in query) || query.key !== process.env.API_KEY) {
    throw new Error('Please provide a valid API Key');
  }

  // await creating a post
  const post = new Post();
  post.title = postFields.title;
  post.description = postFields.description;
  post.tags = postFields.tags;
  post.recipe = postFields.recipe;
  post.difficulty = postFields.difficulty;
  post.time = postFields.time;
  post.featuredImage = postFields.featuredImage;
  post.images = postFields.images;
  post.video = postFields.video;
  post.recipeUrl = postFields.recipeUrl;
  post.likes = [];
  post.comments = postFields.comments;
  post.tags = postFields.tags;
  post.author = user.id;
  post.likeCount = 0;
  post.parent = postFields.parent;

  // return post
  try {
    const savedPost = await post.save();
    if (savedPost.parent != null) {
      const parent = savedPost.parent;
      await Post.findByIdAndUpdate(savedPost.parent, {$addToSet: {children: savedPost.id}});
    } 

    return savedPost;
  } catch (error) {
    throw new Error(`create post error: ${error}`);
  }
}
export async function getPosts(query) {
  if ('search_term' in query) {
    const posts = await Post.find({ $text: { $search: query.search_term } }, '-recipe -comments -likes -parent -children')
      .lean().populate('author', 'username profilePicture').sort({ createdAt: -1 });
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
        const posts = await Post.find({ author: { $in: user.following } }, '-recipe -comments -likes -parent -children')
        .lean().populate('author', 'username profilePicture').sort({ createdAt: -1 });
        return posts;
      // get only unviewed posts
      } else if (query.home === 'unviewed') {
        const posts = await Post.find({ author: { $in: user.following }, _id: { $nin: user.viewedPosts } }, '-recipe -comments -likes -parent -children')
          .lean().populate('author', 'username profilePicture').sort({ createdAt: -1 });
        return posts;
      } else {
        throw new Error('please provide a valid home query value');
      }
    } else if ('discovery' in query) {
      // return posts sorted by most liked that are not made by the user
      if (query.discovery === 'hot') {
        const posts = await Post.find({ author: { $ne: user._id } }, '-recipe -comments -likes -parent -children').sort({ likeCount: -1 });
        return posts;
      } else if (query.discovery === 'recommended') {
        const sortedTags = [...user.likedTags.entries()].sort((a, b) => { return b[1] - a[1]; });
        const promises = [];
        const recommended = Array(Math.min(7, sortedTags.length));
        for (let i = 0; i < Math.min(7, sortedTags.length); i += 1) {
          promises.push(new Promise((resolve, reject) => {
            try {
              const func = async () => {
                const posts = await Post.find({ tags: sortedTags[i][0], author: { $ne: user._id, $nin: user.following }, _id: { $nin: user.viewedPosts } }, '-recipe -comments -likes -parent -children')
                  .lean().sort({ likeCount: -1 });
                return { tag: sortedTags[i][0], posts };
              };
              const result = func();
              resolve(result);
            } catch (error) {
              reject(error);
            }
          }));
        }
        
        try {
          await Promise.all(promises).then((result) => {
            let indices = [];
            for (let i = 0; i < Math.min(7, sortedTags.length); i += 1) {
              indices.push(i);
            }
            let lastIndex = indices.length;
  
            result.map(({ tag, posts }) => {
              let index = Math.floor(Math.random() * lastIndex);
              [indices[lastIndex - 1], indices[index]] = [indices[index], indices[lastIndex - 1]];
              lastIndex -= 1;
              return (
                recommended[indices[lastIndex]] = { tag, posts }
              );
            });
          });
        } catch (error) {
          reject(error);
        }

        return recommended;
      } else {
        throw new Error('please provide a valid discovery query value');
      }
    // get user's posts
    } else {
      const posts = await Post.find({ author: { $in: user._id } }, '-recipe -comments -likes -parent -children' )
        .lean().populate('author', 'username profilePicture').sort({ createdAt: -1 });
      return posts;
    }
  }

  // return all posts
  const posts = await Post.find({}, '-recipe -comments -likes -parent -children')
    .lean().populate('author', 'username profilePicture').sort({ createdAt: -1 });
  return posts;
}
export async function getPost(id) {
  // await finding one post
  const post = await Post.findById(id).lean().populate('author', 'username profilePicture');
  // return post
  if (!post) {
    throw new Error('post not found');
  }
  return post;
}
export async function deletePost(id, query) {
  if (!('key' in query) || query.key !== process.env.API_KEY) {
    throw new Error('Please provide a valid API Key');
  }
  // await deleting a post
  await Post.findByIdAndDelete(id);
  // return confirmation
  return { msg: `post ${id} deleted successfully.` };
}
export async function updatePost(id, query, postFields) {
  try {
    // await updating a post by id
    const post = await Post.findByIdAndUpdate(id, postFields, { returnDocument: 'after' });

    if ('update_type' in query) {
      if (query.update_type === 'like') {
        const user = await User.findById(query.user);
        post.tags.forEach((tag) => {
          if (!user.likedTags.has(tag)) {
            user.likedTags.set(tag, 0);
          }
          user.likedTags.set(tag, user.likedTags.get(tag) + 1);
        });

        user.save();
      }
    } else if (query.update_type === 'dislike') {
      const user = await User.findById(query.user);
      post.tags.forEach((tag) => {
        if (!user.likedTags.has(tag)) {
          user.likedTags.set(tag, 0);
        }
        user.likedTags.set(tag, user.likedTags.get(tag) - 1);
      });

      user.save();
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
