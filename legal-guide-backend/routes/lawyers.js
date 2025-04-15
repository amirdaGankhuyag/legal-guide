const express = require("express");

const {
  getLawyers,
  getLawyer,
  createLawyer,
  updateLawyer,
  deleteLawyer,
  uploadLawyerPhoto,
} = require("../controllers/lawyers");

const router = express.Router();

// api/v1/lawyers
router.route("/").get(getLawyers).post(createLawyer);
// api/v1/lawyers/:id
router.route("/:id").get(getLawyer).put(updateLawyer).delete(deleteLawyer);
// api/v1/lawyers/:id/upload-photo
router.route("/:id/upload-photo").put(uploadLawyerPhoto);

module.exports = router;
