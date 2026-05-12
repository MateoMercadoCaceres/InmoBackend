const NotFoundError = require('../errors/NotFoundError')

function notFound(req, res, next) {
  next(new NotFoundError(`Route ${req.originalUrl} not found`))
}

module.exports = { notFound }
