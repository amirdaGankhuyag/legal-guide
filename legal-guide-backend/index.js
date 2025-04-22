const express = require("express");
const dotenv = require("dotenv");
// morgan logger-ийг файл руу гаргах
const rfs = require("rotating-file-stream");
const path = require("path");
const passportAuth = require("./utils/auth");
const session = require("express-session");

const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
// гараар бичсэн middleware
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/error");
// router-үүд оруулж ирэх
const usersRoutes = require("./routes/users");
const firmsRoutes = require("./routes/firms");
const lawyersRoutes = require("./routes/lawyers");
const infosRoutes = require("./routes/infos");
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

// Манай рест апиг дуудах эрхтэй сайтуудын жагсаалт
const whitelist = ["http://localhost:5173"];

// Өөр домэйн дээр байрлах клиент вэб аппуудаас шаардах шаардлагуудыг энд тодорхойлно
const corsOptions = {
  // Ямар ямар домэйнээс манай рест апиг дуудаж болохыг заана
  origin: function (origin, callback) {
    console.log(origin);
    if (origin === undefined || whitelist.indexOf(origin) !== -1) {
      // Энэ домэйнээс ирсэн request-ийг зөвшөөрнө
      callback(null, true);
    } else {
      // Энэ домэйнээс ирсэн request-ийг зөвшөөрөхгүй
      callback(new Error("Таны хаяг зөвшөөрөгдсөн байх ёстой!"));
    }
  },
  // Клиент талаас эдгээр http header-үүдийг бичиж илгээхийг зөвшөөрнө
  allowHeaders: "Authorization, Content-Type, Set-Cookie",
  // Клиент талаас эдгээр мэссэжүүдийг илгээхийг зөвөөрнө
  methods: "GET, POST, PUT, DELETE",
  // Клиент тал authorization юмуу cookie мэдээллүүдээ илгээхийг зөвшөөрнө
  credentials: true,
};

app.use(express.static(path.join(__dirname, "public"))); // public доторх файлуудыг статик файлууд гэж үзнэ

app.use(cors(corsOptions));
app.use(
  session({
    secret: process.env.EXPRESS_SESSION,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passportAuth.initialize());
app.use(passportAuth.session());

// Body parser
app.use(express.json());
app.use(fileupload());
app.use(cookieParser());
// router-үүдийг ашиглана
app.use(logger);
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/firms", firmsRoutes);
app.use("/api/v1/lawyers", lawyersRoutes);
app.use("/api/v1/infos", infosRoutes);
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
