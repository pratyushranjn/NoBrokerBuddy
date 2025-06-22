const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [5, 'Password must be at least 5 characters'],
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: '',
    },
    listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    location: {
      type: String,
      default: '',
      trim: true,
    },
    profilePic: {
      type: String,
      default: '',
    },
    unreadMessages: {
      type: Number,
      default: 0, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
