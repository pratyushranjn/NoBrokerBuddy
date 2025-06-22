const jwt = require('jsonwebtoken');
const ExpressError = require('../utils/ExpressError');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d', 
  });
};


const protect = async (req, res, next) => {
  let token;

  // Check Authorization header first
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Fallback to cookies
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new ExpressError(StatusCodes.UNAUTHORIZED, "No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new ExpressError(StatusCodes.UNAUTHORIZED, "User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    throw new ExpressError(StatusCodes.UNAUTHORIZED, "Token is invalid or expired");
  }
};


module.exports = {
  generateToken,
  protect,
};


