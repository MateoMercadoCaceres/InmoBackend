const ValidationError = require('../errors/ValidationError')

const ALLOWED_ROLES = ['admin', 'editor', 'advisor', 'user']

function validateCreateUser(req, res, next) {
  const { name, email, role } = req.body

  if (!name) throw new ValidationError('name is required')
  if (!email) throw new ValidationError('email is required')
  if (!role) throw new ValidationError('role is required')

  if (!ALLOWED_ROLES.includes(role)) {
    throw new ValidationError(`role must be one of: ${ALLOWED_ROLES.join(', ')}`)
  }

  next()
}

function validateUpdateUser(req, res, next) {
  const { name, email, role } = req.body

  if (name === undefined && email === undefined && role === undefined) {
    throw new ValidationError('at least one of name, email, role is required')
  }

  if (role !== undefined && !ALLOWED_ROLES.includes(role)) {
    throw new ValidationError(`role must be one of: ${ALLOWED_ROLES.join(', ')}`)
  }

  next()
}

module.exports = { validateCreateUser, validateUpdateUser, ALLOWED_ROLES }
