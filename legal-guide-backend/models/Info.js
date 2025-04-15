const mongoose = require("mongoose");

const InfoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  photoUrl: {
    type: String,
    default: "no-url",
  },
  summary: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Info", InfoSchema);
