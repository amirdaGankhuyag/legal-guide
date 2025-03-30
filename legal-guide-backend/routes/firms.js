const express = require("express");

const {
    getFirms,
} = require("../controllers/firms");

const router = express.Router();

// api/v1/firms
router.route("/").get(getFirms);

module.exports = router;