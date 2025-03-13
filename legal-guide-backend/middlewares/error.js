/** алдааг барих зохиомол middleware */
const errorHandler = (err, req, res, next) => {
  console.log(err.stack.red.underline);

  const error = { ...err };
  error.message = err.message;

  if (error.code === 11000) {
    error.message = "Энэ талбарын утга давхардаж байна!";
    error.statusCode = 400;
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message,
  });
};
module.exports = errorHandler;
