const express = require("express");

const { getInfos, getInfo } = require("../controllers/infos");

const router = express.Router();

// api/v1/infos
router.route("/").get(getInfos);
// api/v1/infos/:id
router.route("/:id").get(getInfo);

module.exports = router;
