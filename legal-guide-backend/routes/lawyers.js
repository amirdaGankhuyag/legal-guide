const express = require("express");

const { getLawyers, getLawyer } = require("../controllers/lawyers");

const router = express.Router();

// api/v1/lawyers
router.route("/").get(getLawyers);
// api/v1/lawyers/:id
router.route("/:id").get(getLawyer);

module.exports = router;