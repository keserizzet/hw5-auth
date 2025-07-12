const createHttpError = require('create-http-error');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // If it's not an HTTP error, create one
  if (!createHttpError.isHttpError(err)) {
    error = createHttpError(500, err.message);
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(error.status).json({
    status: 'error',
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

module.exports = errorHandler; 