const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const protected = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt_token;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized to access this page");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Invalid jwt token");
  }
});

module.exports = { protected };
