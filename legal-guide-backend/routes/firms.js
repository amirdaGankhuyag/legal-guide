const express = require("express");
const { protect, authorize } = require("../middlewares/protect");

const {
  getFirms,
  getAllFirms,
  createFirm,
  getFirm,
  updateFirm,
  deleteFirm,
  uploadFirmPhoto,
  getFirmPhoto,
  createComment,
  updateComment,
  deleteComment,
  getComments,
} = require("../controllers/firms");

const router = express.Router();

// api/v1/firms
router.route("/").get(getFirms).post(protect, authorize("admin"), createFirm);
// api/v1/firms/all
router.route("/all").get(getAllFirms);
// api/v1/firms/:id
router
  .route("/:id")
  .get(getFirm)
  .put(protect, authorize("admin"), updateFirm)
  .delete(protect, authorize("admin"), deleteFirm);
// api/v1/firms/:id/upload-photo
router
  .route("/:id/upload-photo")
  .put(protect, authorize("admin"), uploadFirmPhoto);
// api/v1/firms/:id/photo
router.route("/:id/photo").get(getFirmPhoto);

// api/v1/firms/:id/comments
router.route("/:id/comments").get(getComments).post(protect, createComment);
// api/v1/firms/:id/comments/:commentId
router
  .route("/:id/comments/:commentId")
  .put(protect, authorize("admin"), updateComment)
  .delete(protect, authorize("admin"), deleteComment);

module.exports = router;
