const Firm = require("../models/Firm");
const MyError = require("../utils/myError");
const asyncHandler = require("../middlewares/asyncHandler");

const MAX_PHOTO_SIZE = 16 * 1024 * 1024; // MongoDB document 16MB хязгаартай

/** Бүх хуулийн фирмүүдийн мэдээллийг авах */
exports.getAllFirms = asyncHandler(async (req, res, next) => {
  const firms = await Firm.find({}).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: firms.length,
    data: firms,
  });
});

/** Ойролцоох фирмүүдийн мэдээллийг авах */
exports.getFirms = asyncHandler(async (req, res, next) => {
  const { latMin, latMax, lonMin, lonMax } = req.query;

  if (!latMin || !latMax || !lonMin || !lonMax) {
    throw new MyError("Байршлын хязгаарлалтууд алдаатай", 400);
  }

  const query = {
    "location.latitude": { $gte: Number(latMin), $lte: Number(latMax) },
    "location.longitude": { $gte: Number(lonMin), $lte: Number(lonMax) },
  };

  const firms = await Firm.find(query).sort({
    "location.latitude": 1,
    "location.longitude": 1,
  });

  res.status(200).json({
    success: true,
    count: firms.length,
    data: firms,
  });
});

/** Хуулийн фирм шинээр үүсгэх */
exports.createFirm = asyncHandler(async (req, res, next) => {
  const firm = await Firm.create(req.body);

  res.status(201).json({
    success: true,
    data: firm,
  });
});

/** Заагдсан нэг хуулийн фирмийн мэдээллийг авах */
exports.getFirm = asyncHandler(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);

  if (!firm)
    throw new MyError(
      req.params.id + "ID-тай хуулийн фирм байхгүй байна!",
      404,
    );

  res.status(200).json({
    success: true,
    data: firm,
  });
});

/** Заагдсан нэг хуулийн фирмийн мэдээллийг шинэчлэх */
exports.updateFirm = asyncHandler(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);

  if (!firm)
    throw new MyError(
      req.params.id + "ID-тай хуулийн фирм байхгүй байна!",
      404,
    );

  for (let attr in req.body) firm[attr] = req.body[attr];

  firm.save();

  res.status(200).json({
    success: true,
    data: firm,
  });
});

/** Заагдсан нэг хуулийн фирмийн мэдээллийг устгах */
exports.deleteFirm = asyncHandler(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);

  if (!firm)
    throw new MyError(
      req.params.id + "ID-тай хуулийн фирм байхгүй байна!",
      404,
    );

  await firm.deleteOne();

  res.status(200).json({
    success: true,
    data: firm,
  });
});

/** Заагдсан нэг хуулийн фирмийн зураг оруулах */
exports.uploadFirmPhoto = asyncHandler(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);

  if (!firm)
    throw new MyError(
      req.params.id + "ID-тай хуулийн фирм байхгүй байна!",
      404,
    );

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
  firm.photo = file.name;
  firm.photoData = file.data;
  firm.photoContentType = file.mimetype;
  firm.photoUrl = `${req.protocol}://${req.get("host")}/api/v1/firms/${
    firm._id
  }/photo`;
  await firm.save();

  res.status(200).json({
    success: true,
    data: file.name,
    photoUrl: firm.photoUrl,
  });
});

/** Заагдсан нэг хуулийн фирмийн зургийг буцаах */
exports.getFirmPhoto = asyncHandler(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id).select(
    "+photoData +photoContentType",
  );

  if (!firm || !firm.photoData) {
    throw new MyError("Зураг олдсонгүй", 404);
  }

  res.set("Content-Type", firm.photoContentType || "image/jpeg");
  res.send(firm.photoData);
});

/** Заагдсан нэг хуулийн фирмд шинэ коммент үүсгэх */
exports.createComment = asyncHandler(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);

  if (!firm) {
    throw new MyError(
      req.params.id + " ID-тай хуулийн фирм байхгүй байна!",
      404,
    );
  }

  const { comment } = req.body;
  const newComment = {
    user: req.user._id,
    username: req.user.name,
    comment,
    date: Date.now(),
  };

  firm.comments.push(newComment);
  await firm.save();

  res.status(201).json({
    success: true,
    data: newComment,
  });
});

/** Заагдсан нэг хуулийн фирмийн коммент шинэчлэх */
exports.updateComment = asyncHandler(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);
  if (!firm) {
    throw new MyError(
      req.params.id + " ID-тай хуулийн фирм байхгүй байна!",
      404,
    );
  }
  const comment = firm.comments.id(req.params.commentId);
  if (!comment) {
    throw new MyError("Comment not found", 404);
  }

  if (
    comment.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new MyError("Not authorized to edit this comment", 403);
  }

  comment.comment = req.body.comment;
  await firm.save();

  res.status(200).json({
    success: true,
    data: comment,
  });
});

/** Заагдсан нэг хуулийн фирмийн коммент устгах */
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);
  if (!firm) {
    throw new MyError(
      req.params.id + " ID-тай хуулийн фирм байхгүй байна!",
      404,
    );
  }
  const comment = firm.comments.id(req.params.commentId);
  if (!comment) {
    throw new MyError("Comment not found", 404);
  }

  if (
    comment.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new MyError("Not authorized to delete this comment", 403);
  }

  comment.deleteOne();
  await firm.save();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/** Заагдсан нэг хуулийн фирмийн бүх комментүүдийг авах */
exports.getComments = asyncHandler(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);

  if (!firm) {
    throw new MyError(
      req.params.id + " ID-тай хуулийн фирм байхгүй байна!",
      404,
    );
  }

  res.status(200).json({
    success: true,
    data: firm.comments,
  });
});
