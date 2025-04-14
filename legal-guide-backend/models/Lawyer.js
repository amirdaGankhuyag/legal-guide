const mongoose = require("mongoose");

const LawyerSchema = new mongoose.Schema({
  lastName: {
    type: String,
    required: [true, "Хуульчийн овгийг оруулна уу"],
    trim: true,
    maxLength: [70, "Хуульчийн нэрийн урт дээд тал нь 70 байна!"],
  },
  firstName: {
    type: String,
    required: [true, "Хуульчийн нэрийг оруулна уу"],
    trim: true,
    maxLength: [70, "Хуульчийн овгийн урт дээд тал нь 70 байна!"],
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  contact: {
    phone: {
      type: String,
      required: [true, "Утасны дугаарыг оруулна уу"],
    },
    email: {
      type: String,
      required: [true, "И-мэйл хаягийг оруулна уу"],
      unique: true,
      lowercase: true,
    },
    facebookAcc: {
      type: String,
      default: "",
    },
    instagramAcc: {
      type: String,
      default: "",
    },
  },
  workAddress: {
    type: String,
    required: [true, "Ажлын хаягийг оруулна уу"],
  },
  services: [String],
  position: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Lawyer", LawyerSchema);
