const express = require("express");

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleAuthCallback,
  googleAuthSuccess,
  googleAuthFailure,
} = require("../controllers/users");

const router = express.Router();

// api/v1/users
router.route("/").get(getUsers);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/google").get(googleAuth);
router.route("/google/callback").get(googleAuthCallback);
router.route("/google/success").get(googleAuthSuccess);
router.route("/google/failure").get(googleAuthFailure);
// api/v1/users/:id
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
