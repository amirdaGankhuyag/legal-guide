const { test } = require("node:test");
const assert = require("node:assert");
require("colors"); // errorHandler нь err.stack.red гэж colors-ийн өргөтгөл ашигладаг
const errorHandler = require("../middlewares/error");
const MyError = require("../utils/myError");

// Express-ийн res объектыг дуурайсан mock — status/json дуудалтуудыг бүртгэнэ
const mockRes = () => {
  const res = {};
  res.statusCode = null;
  res.body = null;
  res.status = (code) => {
    res.statusCode = code;
    return res; // Express шиг chain хийх боломжтой
  };
  res.json = (payload) => {
    res.body = payload;
    return res;
  };
  return res;
};

test("MyError-ийн statusCode болон message-ийг хариултад буцаана", () => {
  const res = mockRes();
  errorHandler(new MyError("Фирм олдсонгүй", 404), {}, res, () => {});

  assert.strictEqual(res.statusCode, 404);
  assert.deepStrictEqual(res.body, { success: false, error: "Фирм олдсонгүй" });
});

test("statusCode байхгүй бол 500 буцаана", () => {
  const res = mockRes();
  errorHandler(new Error("Гэнэтийн алдаа"), {}, res, () => {});

  assert.strictEqual(res.statusCode, 500);
  assert.strictEqual(res.body.error, "Гэнэтийн алдаа");
});

test("MongoDB-ийн давхардлын алдааг (code 11000) ойлгомжтой мэдэгдэлтэй 400 болгоно", () => {
  const res = mockRes();
  const dupErr = new Error("E11000 duplicate key error");
  dupErr.code = 11000;
  errorHandler(dupErr, {}, res, () => {});

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.error, "Энэ талбарын утга давхардаж байна!");
});
