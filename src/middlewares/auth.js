const UnauthorizedError = require('../errors/UnauthorizedError')

function requireAuth(req, res, next) {
  // TODO: implement JWT validation
  next()
}

module.exports = { requireAuth }
