const asyncHandler = require("express-async-handler");
const genToken = require("../utils/genToken");
const User = require("../models/User");

// Authenticate a user
const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    genToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// Register a user
const registerUser = asyncHandler(async (req, res, next) => {
  const { email, password, lastName, firstName } = req.body;

  if (!email || !password || !lastName || !firstName) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error(`User ${firstName} already exists in the database`);
  }

  const user = await User.create({
    email,
    password,
    lastName,
    firstName,
  });

  if (user) {
    genToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Logout a user
const logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("jwt_token");
  res.status(200).json({ message: "User logged out" });
});

// Get a user profile
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (user) {
    res.status(200).json({
      _id: user._id,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Update a user profile
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      email: updatedUser.email,
      lastName: updatedUser.lastName,
      firstName: updatedUser.firstName,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  authUser,
  logoutUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
};
