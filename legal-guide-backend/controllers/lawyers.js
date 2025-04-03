const Lawyer = require("../models/Lawyer");
const MyError = require("../utils/myError");
const asyncHandler = require("../middlewares/asyncHandler");

/** Бүх хуульчдын мэдээллийг авах */
exports.getLawyers = asyncHandler(async (req, res, next) => {
  const lawyers = await Lawyer.find();

  if (!lawyers || lawyers.length === 0) {
    throw new MyError("Хуулийн зөвлөхүүд байхгүй байна", 404);
  }

  res.status(200).json({
    success: true,
    count: lawyers.length,
    data: lawyers,
  });
});

/** Заагдсан нэг хуульчийн мэдээллийг авах */
exports.getLawyer = asyncHandler(async (req, res, next) => {
  const lawyer = await Lawyer.findById(req.params.id);

  if (!lawyer) {
    throw new MyError(req.params.id + " ID-тай хуульч олдсонгүй", 404);
  }

  res.status(200).json({
    success: true,
    data: lawyer,
  });
});
