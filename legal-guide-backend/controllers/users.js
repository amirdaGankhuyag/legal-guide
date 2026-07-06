const User = require("../models/User");
const MyError = require("../utils/myError");
const asyncHandler = require("../middlewares/asyncHandler");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const passportAuth = require("../utils/auth");
const { count } = require("console");

/** Google асcount ашиглан нэвтрэх */
exports.googleAuth = passportAuth.authenticate("google", {
  scope: ["profile", "email"],
});
exports.googleAuthCallback = passportAuth.authenticate("google", {
  successRedirect: "/api/v1/users/google/success",
  failureRedirect: "/api/v1/users/google/failure",
});
exports.googleAuthSuccess = asyncHandler(async (req, res, next) => {
  const { token, role } = await req.user;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  res.redirect(`${frontendUrl}/success?token=${token}&role=${role}`);
});
exports.googleAuthFailure = asyncHandler(async (req, res, next) => {
  throw new MyError("Google нэвтрэхэд алдаа гарлаа.", 401);
});

/**  Хэрэглэгч шинээр бүртгүүлэх */
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  const jwt = user.getJsonWebToken();

  res.status(200).json({
    success: true,
    token: jwt,
    user,
  });
});

/** Хэрэглэгч нэвтрэх */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Оролтыг шалгана
  if (!email || !password)
    throw new MyError("Имэйл болон нууц үгээ оруулна уу", 400);
  // Тухайн хэрэглэгчийг хайна
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new MyError("Имэйл болон нууц үгээ зөв оруулна уу", 401);

  // Нууц үгийг шалгах
  const ok = await user.checkPassword(password);
  if (!ok) throw new MyError("Имэйл болон нууц үгээ зөв оруулна уу", 401);

  const token = user.getJsonWebToken();

  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE_DAYS * 24 * 60 * 60 * 1000 // COOKIE_EXPIRE_DAYS хоногийн дараа expire хийнэ
    ),
    httpOnly: true, // client талаас document.cookie гэж cookie-д хандаж чадахгүй
    // Production-д frontend өөр domain дээр байх тул cross-site cookie шаардлагатай
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res.status(200).cookie("legal-guide-token", token, cookieOption).json({
    // cookie-г үүсгэж байна
    success: true,
    token,
    user,
  });
});

/** Хэрэглэгч системээс гарах */
exports.logout = asyncHandler(async (req, res, next) => {
  const cookieOption = {
    expires: new Date(
      Date.now() - process.env.COOKIE_EXPIRE_DAYS * 24 * 60 * 60 * 1000 // cookie-г server талаас устгаж байна
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res
    .status(200)
    .cookie("legal-guide-token", null, cookieOption)
    .cookie("connect.sid", null, cookieOption)
    .json({
      success: true,
      data: "Хэрэглэгч системээс гарлаа!",
    });
});

/** Нууц үг сэргээх */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.email)
    throw new MyError("Та нууц үг сэргээх имэйл хаягаа дамжуулна уу", 403);

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new MyError(
      req.body.email + " имэйл хаягтай хэрэглэгч олдсонгүй!",
      400
    ); // Урт нь ижил боловч байхгүй ID-тай үед ажиллана
  }

  const resetToken = user.generatePasswordChangeToken();
  await user.save();
  // await user.save({ validateBeforeSave: false }); // db-д хадгална, validateBeforeSave: false нь mongoose-ийн validator-уудыг ажлуулахгүй

  //Имэйл илгээнэ
  const link = `http://localhost:5173/reset-password/${resetToken}`;

  const message = `Сайн байна уу. 👋 <br><br>Та нууц үг сэргээх хүсэлт илгээлээ. Нууц үгийг доорх линк дээр дарж солино уу: 👇<br><br><a href="${link}">${link}</a><br><br>Өдрийг сайхан өнгөрүүлээрэй. 💪🥰`;

  const info = await sendEmail({
    email: user.email,
    subject: "Нууц үг сэргээх хүсэлт",
    message,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

  res.status(200).json({
    success: true,
    resetToken,
  });
});

/** Нууц үг солих */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.resetToken || !req.body.password)
    throw new MyError("Та токен болон нууц үгээ дамжуулна уу", 400);

  const encrypted = crypto
    .createHash("sha256")
    .update(req.body.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: encrypted,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new MyError("Токен хүчингүй байна!", 400); // Урт нь ижил боловч байхгүй ID-тай үед ажиллана
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const jwt = user.getJsonWebToken();

  res.status(200).json({
    success: true,
    token: jwt,
    user,
  });
});

/** Бүх хэрэглэгчийн мэдээлэлийг авах */
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  if (!users || users.length === 0)
    throw new MyError("Бүртгэлтэй хэрэглэгч олдсонгүй", 404);

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

/** Заагдсан хэрэглэгчийн мэдээллийг авах */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    throw new MyError(req.params.id + "ID-тай хэрэглэгч олдсонгүй", 404);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/** Тухайн нэг хэрэглэгчийн мэдээллийг шинэчлэх */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new MyError(req.params.id + " ID-тай хэрэглэгч олдсонгүй", 404);
  }

  for (let attr in req.body) user[attr] = req.body[attr];

  user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

/** Тухайн нэг хэрэглэгчийн мэдээллийг устгах */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new MyError(req.params.id + " ID-тай хэрэглэгч олдсонгүй", 404);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    data: user,
  });
});
