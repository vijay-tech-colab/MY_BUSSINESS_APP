class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered ...`;
        err = new ErrorHandler(message , 400);
    }

    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((value) => value.message);
        err = new ErrorHandler(message ,400);
    }
    if (err.name === "JsonWebTokenError") {
        const message = "Json Web Token is invalid. Try again!!!";
        err = new ErrorHandler(message , 400);
    }

    if (err.name === "TokenExpiredError") {
        const message = "Json Web Token is expired. Try again!!!";
        err = new ErrorHandler(message ,400);
    }

    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message ,404);
    }
    const errorMessages = err.errors
        ? Object.values(err.errors)
            .map((value) => value.message)
            .join(" ")
        : err.message;

    res.status(err.statusCode).json({
        success: false,
        message: errorMessages
    });

};

exports.ErrorHandler = ErrorHandler;
exports.errorMiddleware = errorMiddleware;
