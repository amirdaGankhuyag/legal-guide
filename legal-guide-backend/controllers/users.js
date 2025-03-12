const User = require("../models/User");
const MyError = require("../utils/myError");
const asyncHandler = require("../middlewares/asyncHandler");

// Хэрэглэгч шинээр бүртгүүлэх
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    success: true,
    user: req.body,
  });
});
