const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" }); // Апп-ын тохиргоог process.env руу оруулах
const app = express();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(
  process.env.PORT,
  console.log(`Сервер ${process.env.PORT} порт дээр аслаа...`)
);
