const express = require("express");

const {
  getInfos,
  getInfo,
  createInfo,
  updateInfo,
  deleteInfo,
  uploadInfoPhoto,
} = require("../controllers/infos");

const router = express.Router();

// api/v1/infos
router.route("/").get(getInfos).post(createInfo);
// api/v1/infos/:id
router
  .route("/:id")
  .get(getInfo)
  .put(updateInfo)
  .delete(deleteInfo);
// api/v1/infos/:id/upload-photo
router.route("/:id/upload-photo").put(uploadInfoPhoto);

module.exports = router;
