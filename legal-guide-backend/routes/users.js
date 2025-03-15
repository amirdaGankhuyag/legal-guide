const express = require("express");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleAuthCallback,
  googleAuthSuccess,
  googleAuthFailure,
} = require("../controllers/users");

const router = express.Router();

// api/v1/users
router.route("/google").get(googleAuth);
router.route("/google/callback").get(googleAuthCallback);
router.route("/google/success").get(googleAuthSuccess);
router.route("/google/failure").get(googleAuthFailure);

// api/v1/users
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

module.exports = router;
