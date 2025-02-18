const catchAsyncErrors = require("./catchAsyncErrors");
const { ErrorHandler } = require("./error");
const User = require("../Models/userSchema");
const jwt = require('jsonwebtoken');

const authMiddleware = catchAsyncErrors(async (req, res, next) => {
    const {token } = req.cookies;
    if(!token){
        return next(new ErrorHandler("UnAuthorized User ?" ,401));
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decode.id);
    next();
});

module.exports = authMiddleware