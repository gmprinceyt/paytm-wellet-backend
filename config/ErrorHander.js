class CustomError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

const ErrorHandler = (err, req, res, next) => {
  const message = err.message;
  const status = err.status || 500;
  console.log(err);

  res.status(status).json({
    message,
    err,
  });
};

module.exports = { ErrorHandler, CustomError };
