const express = require("express");
const router = express.Router();
const { protect } = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler.js");

const User = require("../models/User.js");

const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUserById,
  updateUserPassword
} = require("../controllers/userController");

router.post("/register", asyncHandler(registerUser));

router.post("/login", asyncHandler(loginUser));

router.post("/logout", logoutUser);

router.get("/me", protect, asyncHandler(getUserProfile));

router.post("/update-profile", protect, asyncHandler(updateUserProfile));

router.post("/update-password", protect, updateUserPassword);

router.get("/:id", protect, getUserById);

router.get("/protected-route", protect, (req, res) => {
  res.json(`Welcome user ${req.user.id}`);
});

module.exports = router;
