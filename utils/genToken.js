const jwt = require("jsonwebtoken");

const generateAuthToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expiration time
  });

  res.cookie("jwt_token", token, {
    httpOnly: true, // Cookie is not accessible via JavaScript
    secure: process.env.NODE_ENV !== "development", // Secure flag for production
    sameSite: "strict", // Cookie only sent to same-site requests
    maxAge: 30 * 24 * 60 * 60 * 1000, // Maximum cookie age (30 days)
  });
};

module.exports = generateAuthToken;
