const express = require("express");
const { protect } = require("../middlewares/protect");
const { chatWithAI } = require("../controllers/chat");

const router = express.Router();

// api/v1/chat
router.route("/").post(protect, chatWithAI);

module.exports = router;
