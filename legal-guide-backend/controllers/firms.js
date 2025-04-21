const Firm = require("../models/Firm");
const MyError = require("../utils/myError");
const asyncHandler = require("../middlewares/asyncHandler");
const uuid = require("uuid").v4;
const bucket = require("../utils/firebaseAdmin");

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
      404
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
      404
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
      404
    );

  await firm.deleteOne();

  res.status(200).json({
    success: true,
    data: firm,
  });
});

/** Заагдсан нэг хуулийн фирмийн зураг оруулах */
// PUT: api/v1/firms/:id/upload-photo
exports.uploadFirmPhoto = asyncHandler(async (req, res, next) => {
  const firm = await Firm.findById(req.params.id);

  if (!firm)
    throw new MyError(
      req.params.id + "ID-тай хуулийн фирм байхгүй байна!",
      404
    );

  // Зураг оруулах
  const file = req.files.file;
  if (!file.mimetype.startsWith("image")) {
    throw new MyError("Та зураг upload хийнэ үү!", 400);
  }

  const fileName = file.name;
  const filePath = `FirmPhotos/${fileName}`;
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

    firm.photoUrl = publicUrl;
    firm.photo = fileName;
    await firm.save();
    res.status(200).json({
      success: true,
      data: fileName,
      photoUrl: publicUrl,
    });
  });
  stream.end(file.data);
});
