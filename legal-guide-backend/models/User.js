const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/** mongoose user schema */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Хэрэглэгчийн нэрийг оруулна уу"],
  },
  email: {
    type: String,
    required: [true, "Хэрэглэгчийн имэйл хаягийг оруулна уу"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Имэйл хаяг буруу байна",
    ],
  },
  role: {
    type: String,
    required: [true, "Хэрэглэгчийн эрхийг оруулна уу"],
    enum: ["user", "admin"], // "admin"-ыг ер нь устгаарай
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Нууц үгийг оруулна уу"],
    minlength: 4,
    select: false, // password талбарыг select хийж client-рүү явуулахыг хорих
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/** Нууц үгийг хэйшлэх */ 
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next(); // Нууц үг өөрчлөгдөөгүй бол дараагийн middleware-рүү шилжих

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

/** JWT token үүсгэх */  
UserSchema.methods.getJsonWebToken = function () {
  const token = jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN, // JWT token-ийн хугацаа дуусах хэмжээ
    }
  );
  return token;
};

/** Нууц үгийг шалгах */ 
UserSchema.methods.checkPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/** Нууц үг сэргээх token үүсгэх */ 
UserSchema.methods.generatePasswordChangeToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex"); // 20 тэмдэгттэй санамсаргүй тоо үүсгэх

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex"); // "sha256" алгоритмаар token-ийг encrypt хийсэн

  this.resetPasswordExpire = Date.now() + 5 * 60 * 1000; // password шинэчлэх хүсэл илгээснээс 5 минутын дараа token хүчингүй болно

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
