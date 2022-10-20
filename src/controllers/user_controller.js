import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs/dist/bcrypt';
import User from '../models/user_model';

dotenv.config({ silent: true });

export async function getUser(id, query) {
  if (!('key' in query) || query.key !== process.env.API_KEY) {
    throw new Error('Please provide a valid API Key');
  }
  const user = await User.findById(id).lean();
  if (!user) {
    throw new Error('user not found');
  }
  return user;
}

export async function getUsers(query) {
  // return searched for users if search_term exists
  if ('search_term' in query) {
    const posts = await User.find({ username: { $regex: query.search_term, $options: 'i' } }).lean();
    return posts;
  }

  const users = await User.find({}, '-email -username -password');
  return users;
}

export async function updateUser(id, userFields, query) {
  if (!('key' in query) || query.key !== process.env.API_KEY) {
    throw new Error('Please provide a valid API Key');
  }
  // hash password if it's being updated
  try {
    if (userFields.password != null) {
      try {
        // salt, hash, then set password to hash
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(userFields.password, salt);
        userFields.password = hash;
      } catch (error) {
        throw new Error('error hashing password');
      }
    }
    const user = await User.findByIdAndUpdate(id, userFields, { returnDocument: 'after' });
    return user;
  } catch (error) {
    console.log(error);
    throw new Error(`update user error: ${error}`);
  }
}

export async function submitConsent(id, consent = true) {
  try {
    const user = await User.findByIdAndUpdate(id, { researchConsent: consent }, { returnDocument: 'after' });
    return user;
  } catch (error) {
    console.log(error);
    throw new Error(`update user error: ${error}`);
  }
}

export async function deleteUser(id, query) {
  if (!('key' in query) || query.key !== process.env.API_KEY) {
    throw new Error('Please provide a valid API Key');
  }
  await User.findByIdAndDelete(id);
  return { msg: `user ${id} deleted successfully.` };
}

export const signin = (user) => {
  return { token: tokenForUser(user), id: user.id };
};

// note the lovely destructuring here indicating that we are passing in an object with these keys
export const signup = async ({
  username, email, password, gender, birthday, interests,
}) => {
  if (!username || !email || !password) {
    throw new Error('You must provide username, email and password');
  }

  // See if a user with the given email exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // If a user with email does exist, return an error
    throw new Error('Email is in use');
  }

  const user = new User();
  user.username = username;
  user.email = email;
  user.password = password;
  user.gender = gender;
  user.birthday = birthday;
  user.interests = interests;
  user.researchConsent = false;

  await user.save();
  return { token: tokenForUser(user), id: user.id };
};

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
