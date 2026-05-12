const ValidationError = require('../errors/ValidationError')

const ALLOWED_ROLES = ['admin', 'editor']

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

module.exports = { validateCreateUser }
