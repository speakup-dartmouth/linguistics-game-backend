import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';

dotenv.config({ silent: true });

export async function getUser(id, query) {
  const user = await User.findById(id);

  // if ('collection-type' in query) {
  // }

  if (!user) {
    throw new Error('user not found');
  }
  return user;
}

export async function getUsers() {
  const users = await User.find();
  return users;
}

export async function updateUser(id, userFields) {
  try {
    console.log(userFields.collections);
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
  await user.save();
  return tokenForUser(user);
};

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
