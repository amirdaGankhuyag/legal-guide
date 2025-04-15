const Info = require("../models/Info");
const MyError = require("../utils/myError");
const asyncHandler = require("../middlewares/asyncHandler");
const uuid = require("uuid").v4;
const bucket = require("../utils/firebaseAdmin");

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
// PUT: api/v1/infos/:id/upload-photo
exports.uploadInfoPhoto = asyncHandler(async (req, res, next) => {
  const info = await Info.findById(req.params.id);

  if (!info)
    throw new MyError(req.params.id + "ID-тай мэдээлэл олдсонгүй", 404);

  // Зураг оруулах
  const file = req.files.file;
  if (!file.mimetype.startsWith("image")) {
    throw new MyError("Та зураг upload хийнэ үү!", 400);
  }

  const fileName = file.name;
  const filePath = `InfoPhotos/${fileName}`;
  const fileUpload = bucket.file(filePath);
  const token = uuid();
  // stream ашиглана
  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });
  stream.on("error", (err) => {
    throw new MyError("Зургийг upload хийхэд алдаа гарлаа!", 500);
  });
  stream.on("finish", async () => {
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(filePath)}?alt=media&token=${token}`;

    info.photoUrl = publicUrl;
    info.photo = fileName;
    await info.save();
    res.status(200).json({
      success: true,
      data: fileName,
      photoUrl: publicUrl,
    });
  });
  stream.end(file.data);
});
