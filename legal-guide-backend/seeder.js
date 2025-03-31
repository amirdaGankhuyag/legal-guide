// seed - DB-ийн анхны утга болон өгөгдлүүдийг хадгалдаг үндэс гэсэн утгатай
const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors"); 
const dotenv = require("dotenv");
const User = require("./models/User");
const Firm = require("./models/Firm");

dotenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGODB_URI);

const users = JSON.parse(
  fs.readFileSync(__dirname + "/data/users.json", "utf8")
); // json гарна

const firms = JSON.parse(
  fs.readFileSync(__dirname + "/data/firms.json", "utf8")
); // json гарна

// categories дотроос унщаад DB-рүү импортлоно.
const importData = async () => {
  try {
    await User.create(users);
    await Firm.create(firms);
    console.log("Өгөгдлийг импортлолоо!".green.inverse); //green.inverse => өнгө
  } catch (err) {
    console.log(`${err}`.red.inverse); //red.inverse => өнгө
  }
};

// Category моделийг ашиглаж бүх Category-г устгана
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Firm.deleteMany();
    console.log("Бүх өгөгдлийг устгалаа!".red.inverse);
  } catch (err) {
    console.log(`${err}`.red.inverse); //red.inverse => өнгө
  }
};

// "node seeder.js {argv}"  команд console-оос өгөхөд аль функц ажиллахыг шийднэ.
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
