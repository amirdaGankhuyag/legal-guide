const { test } = require("node:test");
const assert = require("node:assert");
const asyncHandler = require("../middlewares/asyncHandler");

// asyncHandler нь async controller-ийн exception-ийг барьж next(err) рүү
// дамжуулдаг wrapper — Express-ийн алдааны middleware рүү хүргэдэг гол хэрэгсэл

test("амжилттай async функцийг хэвийн ажиллуулна, next дуудагдахгүй", async () => {
  let nextCalled = false;
  let handlerRan = false;

  const handler = asyncHandler(async () => {
    handlerRan = true;
  });

  await handler({}, {}, () => {
    nextCalled = true;
  });

  assert.strictEqual(handlerRan, true);
  assert.strictEqual(nextCalled, false);
});

test("exception шидэгдвэл next(err) руу дамжуулна", async () => {
  const thrown = new Error("Санаатай алдаа");
  let received = null;

  const handler = asyncHandler(async () => {
    throw thrown;
  });

  // next-ийг promise-оор хүлээж авна (catch нь async ажилладаг тул)
  await new Promise((resolve) => {
    handler({}, {}, (err) => {
      received = err;
      resolve();
    });
  });

  assert.strictEqual(received, thrown);
});
