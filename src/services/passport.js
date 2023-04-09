import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';

import User from '../models/user_model';

// loads in .env file if needed
dotenv.config({ silent: true });

// options for local strategy, we'll use email AS the username
// not have separate ones
const localOptions = { usernameField: 'email' };

// options for jwt strategy
// we'll pass in the jwt in an `authorization` header
// so passport can find it there
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: 'process.env.AUTH_SECRET',
  // secretOrKey: process.env.AUTH_SECRET,
};
// NOTE: we are not calling this a bearer token (although it technically is), if you see people use Bearer in front of token on the internet you could either ignore it, use it but then you have to parse it out here as well as prepend it on the frontend.

// username/email + password authentication strategy
const localLogin = new LocalStrategy(localOptions, async (email, password, done) => { // creating a function using passport-local LocalStrategy authentication strategy, where we've set the usernameField to the user's email (line 13) and establishing email, password, and a callback function called 'done' (of the form done(error, value)) as parameters
  let user; // declaring empty user variable
  let isMatch; // declaring empty isMatch boolean

  try {
    user = await User.findOne({ email }); // querying user model to find the user with a given email address
    if (!user) { // if user isn't in db (user from line 30 is empty)
      return done(null, false); // call callback function with null as first argument (no error) and pass in false en lieu of user object
    }
    isMatch = await user.comparePassword(password); // use our previously created comparePassword method from the UserModel to test if passwords match
    if (!isMatch) { // if it's not a match, the user should not authenticated
      return done(null, false); // call callback function with null as first argument (no error) and pass in false en lieu of user object
    } else { // yay, they're legit!
      return done(null, user); // call callback function with null as first argument (no error) and pass in user object
    }
  } catch (error) {
    return done(error); // call callback function and pass in error
  }
});

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object
  let user;
  try {
    user = await User.findById(payload.sub);
  } catch (error) {
    done(error, false);
  }
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

// Tell passport to use this strategy
passport.use(jwtLogin); // for 'jwt'
passport.use(localLogin); // for 'local'

// middleware functions to use in routes
export const requireAuth = passport.authenticate('jwt', { session: false });
export const requireSignin = passport.authenticate('local', { session: false });
