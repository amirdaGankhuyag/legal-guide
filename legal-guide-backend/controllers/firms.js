const Firm = require("../models/Firm");
const MyError = require("../utils/myError");
const asyncHandler = require("../middlewares/asyncHandler");

//api/v1/firms
exports.getFirms = asyncHandler(async (req, res, next) => {
    const firms = await Firm.find();
    res.status(200).json({
        success: true,
        count: firms.length,
        data: firms,
    });
});