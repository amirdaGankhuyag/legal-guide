// controller буюу гол логик хэсэг

// Хэрэглэгч шинээр бүртгүүлэх
exports.register = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: "Хэрэглэгч бүртгэгдлээ"
    });
};