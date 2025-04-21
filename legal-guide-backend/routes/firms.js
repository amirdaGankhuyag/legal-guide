const express = require("express");

const {
  getFirms,
  getAllFirms,
  createFirm,
  getFirm,
  updateFirm,
  deleteFirm,
  uploadFirmPhoto
} = require("../controllers/firms");

const router = express.Router();

// api/v1/firms
router.route("/").get(getFirms).post(createFirm);
// api/v1/firms/all
router.route("/all").get(getAllFirms);
// api/v1/firms/:id
router.route("/:id").get(getFirm).put(updateFirm).delete(deleteFirm);
// api/v1/firms/:id/upload-photo
router.route("/:id/upload-photo").put(uploadFirmPhoto);

module.exports = router;
