/* eslint-disable func-names */
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import dotenv from 'dotenv';

import { RequestHandler } from 'express';
import { Users } from 'models';

dotenv.config();

const jwtOptions: StrategyOptions = {
  secretOrKey: process.env.AUTH_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if the token matches any user document in the DB
  // Done function in the form -> "done(resulting error, resulting user)"
  Users.findById(payload.sub, (err, user) => {
    // This logic can be modified to check for user attributes
    if (err) {
      return done(err, false); // Error return
    } if (user) {
      return done(null, user); // Valid user return
    }
    return done(null, false); // Catch no valid user return
  });
});

passport.use(jwtLogin);

// Create function to transmit result of authenticate() call to user or next middleware
const requireAuth: RequestHandler = (req, res, next) => {
  // eslint-disable-next-line prefer-arrow-callback
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    // Return any existing errors
    if (err) { return next(err); }

    // If no user found, return appropriate error message
    if (!user) { return res.status(401).json({ message: info?.message || 'Error authenticating email and password' }); }

    req.user = user;

    return next();
  })(req, res, next);
};

export default requireAuth;
