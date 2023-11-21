module.exports = (err, req, res, next) => {
  console.error(err.message, {
    status: err.status,
    stack: err.stack
  });

  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).json({ error: err.message });
};
