const mongoose = require("mongoose");

/** MongoDB-т холбогдох */
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB холбогдлоо : ${conn.connection.host}`.inverse);
};
module.exports = connectDB;
