// Handle page not found error
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Handle any other error
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found. Invalid ID format.";
  }

  res.status(statusCode).json({
    error: {
      message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    },
  });
};

module.exports = { errorHandler, notFound };
