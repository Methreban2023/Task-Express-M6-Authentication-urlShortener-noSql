const notFoundHandler = (req, res, next) => {
  return res.status(404).json({ message: error.message });
};

module.exports = notFoundHandler;
