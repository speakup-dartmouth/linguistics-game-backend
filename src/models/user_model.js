import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs/dist/bcrypt';

const UserSchema = new Schema({
  email: {
    type: String, unique: true, lowercase: true, required: true,
  },
  username: {
    type: String, unique: true, lowercase: true, required: true,
  },
  bio: String,
  password: { type: String, required: true },
  gender: {
    type: String,
    enum: ['male', 'female', 'nonbinary', 'other'],
  },
  birthday: Date,
  interests: [String],
  researchConsent: Boolean,
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

UserSchema.index({
  username: 'text',
});

UserSchema.pre('save', async function beforeUserSave(next) {
  // get access to the user model
  const user = this;

  if (!user.isModified('password')) return next();

  try {
    // salt, hash, then set password to hash
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

// note use of named function rather than arrow notation, required here
UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  const comparison = await bcrypt.compare(candidatePassword, this.password);
  return comparison;
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
