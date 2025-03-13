const express = require("express");

const { register, login, forgotPassword, resetPassword } = require("../controllers/users");

const router = express.Router();

// api/v1/users
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

module.exports = router;
