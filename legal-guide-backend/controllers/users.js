const User = require("../models/User");
const MyError = require("../utils/myError");
const asyncHandler = require("../middlewares/asyncHandler");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

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

  res.status(200).json({
    // cookie-г үүсгэж байна
    success: true,
    token,
    user,
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
  const link = `https://legal-guide.mn/changepassword/${resetToken}`;

  const message = `Сайн байна уу. 👋 <br><br>Та нууц үг сэргээх хүсэлт илгээлээ. Нууц үгийг доорх линк дээр дарж солино уу: 👇<br><br><a target="_blanks" href="${link}">${link}</a><br><br>Өдрийг сайхан өнгөрүүлээрэй. 💪🥰`;

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
    user: user,
  });
});
