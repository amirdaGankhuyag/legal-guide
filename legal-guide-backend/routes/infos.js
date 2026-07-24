const express = require("express");
const { protect, authorize } = require("../middlewares/protect");

const {
  getInfos,
  getInfo,
  createInfo,
  updateInfo,
  deleteInfo,
  uploadInfoPhoto,
  getInfoPhoto,
} = require("../controllers/infos");

const router = express.Router();

// api/v1/infos
router.route("/").get(getInfos).post(protect, authorize("admin"), createInfo);
// api/v1/infos/:id
router
  .route("/:id")
  .get(getInfo)
  .put(protect, authorize("admin"), updateInfo)
  .delete(protect, authorize("admin"), deleteInfo);
// api/v1/infos/:id/upload-photo
router
  .route("/:id/upload-photo")
  .put(protect, authorize("admin"), uploadInfoPhoto);
// api/v1/infos/:id/photo
router.route("/:id/photo").get(getInfoPhoto);

module.exports = router;
