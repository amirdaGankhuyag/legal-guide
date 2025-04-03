const mongoose = require("mongoose");

const LawyerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Хуульчийн нэрийг оруулна уу"],
    trim: true,
    maxLength: [70, "Хуульчийн нэрийн урт дээд тал нь 70 байна!"],
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Lawyer", LawyerSchema);
