const Lawyer = require("../models/Lawyer");
const MyError = require("../utils/myError");
const asyncHandler = require("../middlewares/asyncHandler");
const bucket = require("../utils/firebaseAdmin");
const uuid = require("uuid").v4;

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
// PUT: /api/v1/lawyers/:id/upload-photo
exports.uploadLawyerPhoto = asyncHandler(async (req, res, next) => {
  const lawyer = await Lawyer.findById(req.params.id);

  if (!lawyer) {
    throw new MyError(req.params.id + " ID-тай хуульч олдсонгүй", 404);
  }

  // Зураг оруулах
  const file = req.files.file;
  if (!file.mimetype.startsWith("image")) {
    throw new MyError("Та зураг upload хийнэ үү!", 400);
  }

  const fileName = file.name;
  const filePath = `LawyerPhotos/${fileName}`;
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

    lawyer.photoUrl = publicUrl;
    lawyer.photo = fileName;
    await lawyer.save();
    res.status(200).json({
      success: true,
      data: fileName,
      photoUrl: publicUrl,
    });
  });
  stream.end(file.data);
});
