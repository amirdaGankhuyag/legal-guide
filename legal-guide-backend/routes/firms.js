const express = require("express");

const { getFirms, createFirm, getFirm } = require("../controllers/firms");

const router = express.Router();

// api/v1/firms
router.route("/").get(getFirms).post(createFirm);
// api/v1/firms/:id
router.route("/:id").get(getFirm);

module.exports = router;
