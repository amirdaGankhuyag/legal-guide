const Lawyer = require("../models/Lawyer");
const MyError = require("../utils/myError");
const asyncHandler = require("../middlewares/asyncHandler");

const MAX_PHOTO_SIZE = 16 * 1024 * 1024; // MongoDB document 16MB хязгаартай

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

/** Хуульч шинээр үүсгэх */
exports.createLawyer = asyncHandler(async (req, res, next) => {
  const lawyer = await Lawyer.create(req.body);
  
  if (!req.body.contact || !req.body.contact.email) {
    return res.status(400).json({
      success: false,
      error: "И-мэйл хаяг оруулаагүй байна!",
    });
  }

  res.status(201).json({
    success: true,
    data: lawyer,
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

/** Заагдсан нэг хуульчийн мэдээллийг шинэчлэх */
exports.updateLawyer = asyncHandler(async (req, res, next) => {
  const lawyer = await Lawyer.findById(req.params.id);

  if (!lawyer) {
    throw new MyError(req.params.id + " ID-тай хуульч олдсонгүй", 404);
  }

  for (let attr in req.body) lawyer[attr] = req.body[attr];

  lawyer.save();

  res.status(200).json({
    success: true,
    data: lawyer,
  });
});

/** Заагдсан нэг хуульчийн мэдээллийг устгах */
exports.deleteLawyer = asyncHandler(async (req, res, next) => {
  const lawyer = await Lawyer.findById(req.params.id);

  if (!lawyer) {
    throw new MyError(req.params.id + " ID-тай хуульч олдсонгүй", 404);
  }

  await lawyer.deleteOne();

  res.status(200).json({
    success: true,
    data: lawyer,
  });
});

/** Заагдсан нэг хуульчийн зураг оруулах */
exports.uploadLawyerPhoto = asyncHandler(async (req, res, next) => {
  const lawyer = await Lawyer.findById(req.params.id);

  if (!lawyer) {
    throw new MyError(req.params.id + " ID-тай хуульч олдсонгүй", 404);
  }

  // Зураг оруулах
  if (!req.files || !req.files.file) {
    throw new MyError("Та зураг upload хийнэ үү!", 400);
  }
  const file = req.files.file;
  if (!file.mimetype.startsWith("image")) {
    throw new MyError("Та зураг upload хийнэ үү!", 400);
  }
  if (file.size > MAX_PHOTO_SIZE) {
    throw new MyError("Зургийн хэмжээ 16MB-аас хэтрэхгүй байх ёстой!", 400);
  }

  // Зургийг MongoDB-д хадгална
  lawyer.photo = file.name;
  lawyer.photoData = file.data;
  lawyer.photoContentType = file.mimetype;
  lawyer.photoUrl = `${req.protocol}://${req.get("host")}/api/v1/lawyers/${
    lawyer._id
  }/photo`;
  await lawyer.save();

  res.status(200).json({
    success: true,
    data: file.name,
    photoUrl: lawyer.photoUrl,
  });
});

/** Заагдсан нэг хуульчийн зургийг буцаах */
exports.getLawyerPhoto = asyncHandler(async (req, res, next) => {
  const lawyer = await Lawyer.findById(req.params.id).select(
    "+photoData +photoContentType"
  );

  if (!lawyer || !lawyer.photoData) {
    throw new MyError("Зураг олдсонгүй", 404);
  }

  res.set("Content-Type", lawyer.photoContentType || "image/jpeg");
  res.send(lawyer.photoData);
});
