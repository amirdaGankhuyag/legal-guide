const Firm = require("../models/Firm");
const MyError = require("../utils/myError");
const asyncHandler = require("../middlewares/asyncHandler");

//api/v1/firms
exports.getFirms = asyncHandler(async (req, res, next) => {
  console.log(req.query);
  const { latMin, latMax, lonMin, lonMax } = req.query;

  if (!latMin || !latMax || !lonMin || !lonMax) {
    return res.status(400).json({
      success: false,
      message: "Invalid location parameters",
    });
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
