/** алдааг барих зохиомол middleware */
const errorHandler = (err, req, res, next) => {
  console.log(err.stack.red.underline);

  const error = { ...err };
  error.message = err.message;

  if (error.code === 11000) {
    error.message = "Энэ талбарын утга давхардаж байна!";
    error.statusCode = 400;
  }

  // хуучин: res.status(err.statusCode || 500).json({ success: false, error: err.message });
  // 11000-ийн салбарт error.message/statusCode-д оноосон утга ашиглагдахгүй байсан тул error-оос авна
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message,
  });
};
module.exports = errorHandler;
