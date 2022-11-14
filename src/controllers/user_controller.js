import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs/dist/bcrypt';
import User from '../models/user_model';
import { validateEmail } from '../common/auth_utils';

dotenv.config({ silent: true });

export async function getUser(id, query) {
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
  } else {
    console.log(query);
  }
  const users = await User.find({}, '-email -username -password');
  return users;
}

function getBirthdayMin(age) {
  const dateOfBirth = new Date(new Date().getTime() - age * 3.154e+10 - 364 * 8.64e+7);
  return dateOfBirth;
}

function getBirthdayMax(age) {
  const dateOfBirth = new Date(new Date().getTime() - age * 3.154e+10);
  return dateOfBirth;
}

export async function getUserIDs(query) {
  const queries = [{ researchConsent: true }]; // must have consent for research
  if (query) {
    if ('age' in query) {
      queries.push({
        birthday: {
          $gte: getBirthdayMin(query.age),
          $lt: getBirthdayMax(query.age),
        },
      });
      delete query.age;
    }
    if ('gender' in query) {
      queries.push({ gender: query.gender });
      delete query.gender;
    }

    Object.entries(query).filter(([key, value]) => { return value !== null; });
    Object.entries(query).forEach((e) => {
      console.log(query[e[0]]);
      console.log(query[e[1]]);
      // eslint-disable-next-line
      if (query[e[0]] && (query[e[1]] != null || query[e[1]] != '' || typeof query[e[1]] === 'boolean')) {
        if (query[e[0]].constructor === Array) {
          queries.push({ [`demographicAttributes.${e[0]}`]: { $in: e[1] } });
        } else {
          queries.push({ [`demographicAttributes.${e[0]}`]: e[1] });
        }
      }
    });
  }
  const userIDs = await User.find({ $and: queries }).distinct('_id');
  return userIDs;
}

export async function getTopUsers() {
  // return searched for users, sorted by score
  const users = await User.find({}).sort({ score: -1 });
  return users;
}

export async function updateUser(id, userFields) {
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

export async function deleteUser(id) {
  await User.findByIdAndDelete(id);
  return { msg: `user ${id} deleted successfully.` };
}

export async function updateScore(id, increment) {
  console.log(`updating score by ${increment} for user ${id}`);
  await User.findByIdAndUpdate(id, { $inc: { score: increment } });
  return { msg: `score of user ${id} updated successfully.` };
}

export const signin = (user) => {
  return { token: tokenForUser(user), id: user.id, role: user.role };
};

// note the lovely destructuring here indicating that we are passing in an object with these keys
export const signup = async ({
  username, email, password, gender, birthday, interests,
}) => {
  if (!username || !email || !password) {
    throw new Error('You must provide username, email and password');
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  if (new Date(birthday) > new Date()) {
    throw new Error('Birthday must be in the past');
  }

  if (!validateEmail(email)) {
    throw new Error('Email is not valid');
  }

  // See if a user with the given email exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // If a user with email does exist, return an error
    throw new Error('Email is already in use');
  }

  // See if username is taken
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    // If a user with username does exist, return an error
    throw new Error('Username is already in use');
  }

  const user = new User();
  user.username = username;
  user.email = email;
  user.password = password;
  user.gender = gender;
  user.birthday = new Date(birthday);
  user.interests = interests;
  user.researchConsent = false;
  user.role = 'USER';

  await user.save();
  return { token: tokenForUser(user), id: user.id };
};

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
