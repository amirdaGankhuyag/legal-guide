/** console дээр log хэвлэх middleware */
const logger = (req, res, next) => {
  console.log("---------------COOKIES: ", req.cookies);
  console.log(
    `${req.method} ${req.protocol}://${req.hostname}${req.originalUrl}`
  );
  next();
};

module.exports = logger;
