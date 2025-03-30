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
  address: {
    type: String,
    required: [true, "Фирмийн хаягийг оруулна уу"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Firm", FirmSchema);
