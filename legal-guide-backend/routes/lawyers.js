const express = require("express");
const { protect, authorize } = require("../middlewares/protect");

const {
  getLawyers,
  getLawyer,
  createLawyer,
  updateLawyer,
  deleteLawyer,
  uploadLawyerPhoto,
  getLawyerPhoto,
} = require("../controllers/lawyers");

const router = express.Router();

// api/v1/lawyers
router
  .route("/")
  .get(getLawyers)
  .post(protect, authorize("admin"), createLawyer);
// api/v1/lawyers/:id
router
  .route("/:id")
  .get(getLawyer)
  .put(protect, authorize("admin"), updateLawyer)
  .delete(protect, authorize("admin"), deleteLawyer);
// api/v1/lawyers/:id/upload-photo
router
  .route("/:id/upload-photo")
  .put(protect, authorize("admin"), uploadLawyerPhoto);
// api/v1/lawyers/:id/photo
router.route("/:id/photo").get(getLawyerPhoto);

module.exports = router;
