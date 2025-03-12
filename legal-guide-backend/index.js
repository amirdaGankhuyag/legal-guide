const express = require("express");
const dotenv = require("dotenv");
// morgan logger-ийг файл руу гаргах
const rfs = require("rotating-file-stream");
const path = require("path");

const morgan = require("morgan");
const colors = require("colors");
// гараар бичсэн middleware
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/error");
// router-үүд оруулж ирэх
const usersRoutes = require("./routes/users");
// Database
const connectDB = require("./config/db");

const app = express();

dotenv.config({ path: "./config/config.env" }); // Апп-ын тохиргоог process.env руу оруулах
connectDB(); 

// access.log файлыг үүсгэх
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

// Body parser
app.use(express.json());
// router-үүдийг ашиглана
app.use(logger);
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/v1/users", usersRoutes);
app.use(errorHandler);

const server = app.listen(
  process.env.PORT,
  console.log(`Сервер ${process.env.PORT} порт дээр аслаа`.inverse)
);

// Баригдалгүй цацагдсан бүх алдаануудыг энд барьж авна
process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа: ${err.message}`.underline.red);
  server.close(() => {
    process.exit(1);
  });
});