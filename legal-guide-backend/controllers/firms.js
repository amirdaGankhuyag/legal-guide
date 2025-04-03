const Firm = require("../models/Firm");
const MyError = require("../utils/myError");
const asyncHandler = require("../middlewares/asyncHandler");

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
