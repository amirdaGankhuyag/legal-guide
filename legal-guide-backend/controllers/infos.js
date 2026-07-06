const Info = require("../models/Info");
const MyError = require("../utils/myError");
const asyncHandler = require("../middlewares/asyncHandler");

const MAX_PHOTO_SIZE = 16 * 1024 * 1024; // MongoDB document 16MB хязгаартай

/** Бүх мэдээллийг авах */
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

/** Заагдсан нэг мэдээллийг авах */
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

/** Шинэ мэдээлэл үүсгэх */
exports.createInfo = asyncHandler(async (req, res, next) => {
  const info = await Info.create(req.body);

  res.status(201).json({
    success: true,
    data: info,
  });
});

/** Заагдсан нэг мэдээллийг өөрчлөх */
exports.updateInfo = asyncHandler(async (req, res, next) => {
  const info = await Info.findById(req.params.id);

  if (!info)
    throw new MyError(req.params.id + "ID-тай мэдээлэл олдсонгүй", 404);

  for (let attr in req.body) info[attr] = req.body[attr];

  info.save();

  res.status(200).json({
    success: true,
    data: info,
  });
});

/** Заагдсан нэг мэдээллийг устгах */
exports.deleteInfo = asyncHandler(async (req, res, next) => {
  const info = await Info.findById(req.params.id);

  if (!info)
    throw new MyError(req.params.id + "ID-тай мэдээлэл олдсонгүй", 404);

  await info.deleteOne();

  res.status(200).json({
    success: true,
    data: info,
  });
});

/** Заагдсан мэдээллийн зураг оруулах */
exports.uploadInfoPhoto = asyncHandler(async (req, res, next) => {
  const info = await Info.findById(req.params.id);

  if (!info)
    throw new MyError(req.params.id + "ID-тай мэдээлэл олдсонгүй", 404);

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
  info.photo = file.name;
  info.photoData = file.data;
  info.photoContentType = file.mimetype;
  info.photoUrl = `${req.protocol}://${req.get("host")}/api/v1/infos/${
    info._id
  }/photo`;
  await info.save();

  res.status(200).json({
    success: true,
    data: file.name,
    photoUrl: info.photoUrl,
  });
});

/** Заагдсан мэдээллийн зургийг буцаах */
exports.getInfoPhoto = asyncHandler(async (req, res, next) => {
  const info = await Info.findById(req.params.id).select(
    "+photoData +photoContentType"
  );

  if (!info || !info.photoData) {
    throw new MyError("Зураг олдсонгүй", 404);
  }

  res.set("Content-Type", info.photoContentType || "image/jpeg");
  res.send(info.photoData);
});
