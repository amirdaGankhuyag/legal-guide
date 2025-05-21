const express = require("express");
const { protect } = require("../middlewares/protect");

const {
  getFirms,
  getAllFirms,
  createFirm,
  getFirm,
  updateFirm,
  deleteFirm,
  uploadFirmPhoto,
  addComment,
  editComment,
  deleteComment,
  getComments,
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

// api/v1/firms/:id/comments
router.route("/:id/comments").get(getComments).post(protect, addComment);
// api/v1/firms/:id/comments/:id
router.route("/:id/comments/:id").put(editComment).delete(deleteComment);

module.exports = router;
