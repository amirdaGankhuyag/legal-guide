const Info = require("../models/Info");
const MyError = require("../utils/myError");
const asyncHandler = require("../middlewares/asyncHandler");

//** Бүх мэдээллийг авах */
exports.getInfos = asyncHandler(async (req, res, next) => {
  const infos = await Info.find().sort({ createdAt: -1 });

  if (!infos || infos.length === 0) {
    throw new MyError("Мэдээлэл байхгүй байна", 404);
  }

  res.status(200).json({
    success: true,
    count: infos.length,
    data: infos,
  });
});

//** Заагдсан нэг мэдээллийг авах */
exports.getInfo = asyncHandler(async (req, res, next) => {
  const info = await Info.findById(req.params.id);

  if (!info) {
    throw new MyError(req.params.id + " ID-тай мэдээлэл олдсонгүй", 404);
  }

  res.status(200).json({
    success: true,
    data: info,
  });
});
