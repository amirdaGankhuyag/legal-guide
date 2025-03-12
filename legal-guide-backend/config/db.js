// Database-тэй холбох код
const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB холбогдлоо : ${conn.connection.host}`.inverse);
};
module.exports = connectDB;
