const { test } = require("node:test");
const assert = require("node:assert");
const MyError = require("../utils/myError");

// MyError бол Error-ийн өргөтгөл: message + HTTP statusCode хадгалдаг

test("MyError нь message болон statusCode-оо зөв хадгална", () => {
  const err = new MyError("Фирм олдсонгүй", 404);
  assert.strictEqual(err.message, "Фирм олдсонгүй");
  assert.strictEqual(err.statusCode, 404);
});

test("MyError нь Error классын удамшил мөн", () => {
  const err = new MyError("Алдаа", 400);
  assert.ok(err instanceof Error);
  assert.ok(err instanceof MyError);
});
