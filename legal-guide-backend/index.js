const express = require("express");
const dotenv = require("dotenv");
// morgan logger-ийг файл руу гаргах
const rfs = require("rotating-file-stream");
const path = require("path");

const morgan = require("morgan");
// гараар бичсэн middleware
const logger = require("./middlewares/logger");
// router-үүд оруулж ирэх
const usersRoutes = require("./routes/users");

// access.log файлыг үүсгэх
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

dotenv.config({ path: "./config/config.env" }); // Апп-ын тохиргоог process.env руу оруулах
const app = express();

// router-үүдийг ашиглана
app.use(logger);
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/v1/users", usersRoutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(
  process.env.PORT,
  console.log(`Сервер ${process.env.PORT} порт дээр аслаа...`)
);
