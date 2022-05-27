import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';

dotenv.config({ silent: true });

export async function getUser(id, query) {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('user not found');
  }
  return user;
}

export async function getUsers(query) {
  // return searched for users if search_term exists
  if ('search_term' in query) {
    const posts = await User.find({ username: { $regex: query.search_term, $options: 'i' } });
    return posts;
  }

  const users = await User.find();
  return users;
}

export async function updateUser(id, userFields) {
  try {
    const user = await User.findByIdAndUpdate(id, userFields, { returnDocument: 'after' });
    return user;
  } catch (error) {
    console.log(error);
    throw new Error(`update user error: ${error}`);
  }
}

export async function deleteUser(id) {
  await User.findByIdAndDelete(id);
  return { msg: `user ${id} deleted successfully.` };
}

export async function getCollections(id, query) {
  if ('collection_type' in query) {
    if (query.collection_type === 'date') {
      const user = await User.findById(id).populate({ path: 'collections.posts' });

      if (!user) {
        throw new Error('user not found');
      }

      let savedPosts = [];
      user.collections.forEach((collection) => {
        savedPosts = savedPosts.concat(collection.posts);
      });

      // sort by createdAt, most recent is at beginning of list
      savedPosts.sort((a, b) => { return b.createdAt - a.createdAt; });
      return savedPosts;
    } else if (query.collection_type === 'difficulty') {
      const user = await User.findById(id).populate({ path: 'collections.posts' });

      if (!user) {
        throw new Error('user not found');
      }

      let savedPosts = [];
      user.collections.forEach((collection) => {
        savedPosts = savedPosts.concat(collection.posts);
      });

      // sort by difficulty, most easy is at beginning of list
      savedPosts.sort((a, b) => { return a.difficulty - b.difficulty; });
      return savedPosts;
    } else if (query.collection_type === 'collections') {
      const user = await User.findById(id).populate({ path: 'collections.posts' });

      if (!user) {
        throw new Error('user not found');
      }

      return user.collections;
    } else if (query.collection_type === 'search') {
      if (!('search_term' in query)) {
        throw new Error('Please enter a search_term');
      }
      const user = await User.findById(id).populate({ path: 'collections.posts' });

      if (!user) {
        throw new Error('user not found');
      }

      let savedPosts = [];
      user.collections.forEach((collection) => {
        savedPosts = savedPosts.concat(collection.posts);
      });

      // only include savedPosts that contain the search term
      savedPosts = savedPosts.filter((post) => {
        return (post.title != null && post.title.includes(query.search_term))
        || (post.type != null && post.type.includes(query.search_term)) || (post.tags != null && post.tags.includes(query.search_term))
        || (post.recipe != null && post.recipie.includes(query.search_term));
      });
      return savedPosts;
    } else {
      throw new Error('Please provide a valid collection_type query value');
    }
  } else {
    throw new Error('Please provide a collection_type query');
  }
}

export const signin = (user) => {
  return tokenForUser(user);
};

// note the lovely destructuring here indicating that we are passing in an object with these 3 keys
export const signup = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('You must provide email and password');
  }

  // See if a user with the given email exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // If a user with email does exist, return an error
    throw new Error('Email is in use');
  }

  const user = new User();
  user.email = email;
  user.password = password;
  user.likedTags = new Map();
  await user.save();
  return tokenForUser(user);
};

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
