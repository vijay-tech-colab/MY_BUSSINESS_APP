const sendToken = (res, user, statusCode ,message) => {
    const token = user.getJwtToken();
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Cross-origin safe
    };
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        message
    });

}


module.exports = sendToken;