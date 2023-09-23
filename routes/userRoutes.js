const { Router } = require("express");
const {
  authUser,
  logoutUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protected } = require("../middleware/authMiddleware");

const router = Router();

// Register a new user
router.post("/", registerUser);

// Authenticate user
router.post("/auth", authUser);

// Logout user
router.post("/logout", logoutUser);

// Get and update user profile (protected routes)
router
  .route("/profile")
  .get(protected, getUserProfile)
  .put(protected, updateUserProfile);

module.exports = router;
