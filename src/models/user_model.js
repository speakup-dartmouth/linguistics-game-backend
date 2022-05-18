import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs/dist/bcrypt';

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  username: { type: String, unique: true, lowercase: true },
  bio: { type: String },
  password: { type: String },
  following: {type: [String]}
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
