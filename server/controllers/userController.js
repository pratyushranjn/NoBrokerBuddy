const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken.js");

const registerUser = async (req, res, next) => {
  const { name, email, password, confirmPassword, location, profilePic } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    throw new ExpressError(
      StatusCodes.BAD_REQUEST,
      "Name, email, password, and confirmPassword are required"
    );
  }

  if (name === password) {
    throw new ExpressError(StatusCodes.BAD_REQUEST, "Name cannot be the same as the password");
  }

  if (password.length < 5) {
    throw new ExpressError(StatusCodes.BAD_REQUEST, "Password must be at least 5 characters");
  }

  if (password !== confirmPassword) {
    throw new ExpressError(StatusCodes.BAD_REQUEST, "Passwords do not match");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ExpressError(StatusCodes.CONFLICT, "Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    location,
    profilePic,
  });

  const token = generateToken(user._id);
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,            // Always true on HTTPS
    sameSite: 'none',        // MUST be 'none' for cross-origin cookies
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(StatusCodes.CREATED).json({
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profilePic,
      location: user.location
    },
  });
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ExpressError(StatusCodes.BAD_REQUEST, 'Email and password are required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ExpressError(StatusCodes.UNAUTHORIZED, 'User not registered');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ExpressError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  const token = generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,            // Always true on HTTPS
    sameSite: 'none',        // MUST be 'none' for cross-origin cookies
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(StatusCodes.OK).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profilePic,
      location: user.location
    },
  });
}

const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  res.status(StatusCodes.OK).json({ message: 'Logout successful' });
};



const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password')
    .populate('listings');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ user });
};


const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, email, phone, city, password } = req.body;

  // Check if the email is changing and if it's already used by another user
  if (email !== user.email) {
    const existing = await User.findOne({ email });
    if (existing && existing._id.toString() !== user._id.toString()) {
      return res.status(409).json({ message: "Email is already in use by another user" });
    }
  }

  user.name = name;
  user.email = email;
  user.phoneNumber = phone;
  user.location = city;
  await user.save();

  res.json({ message: "User updated" });
};



const updateUserPassword = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { currentPassword, newPassword } = req.body;

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated successfully" });
};



const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get user by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  getUserById,
  updateUserPassword
};

