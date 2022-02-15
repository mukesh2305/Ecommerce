const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal server error";

    // Wrong Mongodb Id error
    if (err.name === "CastError") {
        const message = `Resource not found .Invalid ${err.value}`;
        err = new ErrorHandler(message, 400);
    }

    // Mongoose duplicate key error 
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Enterd`;
        err = new ErrorHandler(message, 400);
    }

    // Wrong JWT error 
    if (err.name === "JsonWebTokenError") {
        const message = `JWT is invalid, Try again`;
        err = new ErrorHandler(message, 400);
    }

    // JWT Expire error 
    if (err.name === "TokenExpiredError") {
        const message = `JWT is Expire, Try again`;
        err = new ErrorHandler(message, 400);

    }
    // console.log(err)
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
