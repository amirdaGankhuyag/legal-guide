const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const MyError = require("../utils/myError");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  let token = null;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1]; // Authentication дотроос token-оо салгаж авна
  } else if (req.cookies) {
    token = req.cookies["legal-guide-token"]; // Cookie-оос token-оо салгаж авна
  }

  if (!token) {
    throw new MyError(
      "Энэ үйлдлийг хийхэд таны эрх хүрэхгүй байна. Та эхлээд логин хийнэ үү. Authorization header-ээр эсвэл Cookie ашиглан token-оо дамжуулна уу!",
      401
    );
  }

  const tokenObj = jwt.verify(token, process.env.JWT_SECRET); // Token шалгах

  // Find user and attach to request
  const user = await User.findById(tokenObj.id);
  if (!user) {
    throw new MyError("User not found", 404);
  }

  req.user = user;
  req.userId = tokenObj.id;
  req.userRole = tokenObj.role;

  next();
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole))
      throw new MyError(
        "Таны эрх [" +
          req.userRole +
          "] энэ үйлдлийг гүйцэтгэх боломгүй байна.",
        403
      );
    next();
  };
};
