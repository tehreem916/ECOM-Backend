module.exports = (err, req, res, next) => {
    let error = { ...err, message: err.message };
    error.statusCode = err.statusCode || 500;

    if (err.name === "CastError") {
        error.message = `Resource not found. Invalid: ${err.path}`;
        error.statusCode = 400;
    } else if (err.code === 11000) {
        error.message = `Duplicate ${Object.keys(err.keyValue).join(", ")} entered`;
        error.statusCode = 400;
    } else if (err.name === "ValidationError") {
        error.message = Object.values(err.errors).map((item) => item.message).join(", ");
        error.statusCode = 400;
    } else if (err.name === "JsonWebTokenError") {
        error.message = "JSON Web Token is invalid, try again";
        error.statusCode = 400;
    } else if (err.name === "TokenExpiredError") {
        error.message = "JSON Web Token is expired, try again";
        error.statusCode = 400;
    }

    res.status(error.statusCode).json({ success: false, message: error.message });
};
