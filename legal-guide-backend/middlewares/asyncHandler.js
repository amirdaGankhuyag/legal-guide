/** func функц Promise буцааж байгаа учраас resolve хийгээд func дотроос exception шидэгдвэл catch барьж аваад next функцийн аргумент руу нь дамжуулаад дуудна гэсэн үг. */
const asyncHandler = (func) => (req, res, next) =>
  Promise.resolve(func(req, res, next)).catch(next);
module.exports = asyncHandler;
