const express = require("express");

const { register } = require("../controllers/users");

const router = express.Router();

// api/v1/users/register
router.route("/register").post(register);

module.exports = router;
