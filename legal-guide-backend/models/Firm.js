const mongoose = require("mongoose");

const FirmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Фирмийн нэрийг оруулна уу"],
    trim: true,
    unique: true,
    maxLength: [250, "Фирмийн урт дээд тал нь 250 байна!"],
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  photoUrl: {
    type: String,
    default: "no-url",
  },
  address: {
    type: String,
    required: [true, "Фирмийн хаягийг оруулна уу"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  services: [String],
  contact: {
    phone: String,
    email: String,
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
module.exports = mongoose.model("Firm", FirmSchema);
