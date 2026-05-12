const { ALLOWED_STATUSES } = require('../constants/propertyStatuses')
const ValidationError = require('../errors/ValidationError')

function validateCreateProperty(req, res, next) {
  const { type_id, availability_status } = req.body

  if (!type_id) throw new ValidationError('type_id is required')

  if (availability_status && !ALLOWED_STATUSES.includes(availability_status)) {
    throw new ValidationError(
      `availability_status must be one of: ${ALLOWED_STATUSES.join(', ')}`
    )
  }

  next()
}

function validateUpdateStatus(req, res, next) {
  const { status } = req.body

  if (!status) throw new ValidationError('status is required')

  if (!ALLOWED_STATUSES.includes(status)) {
    throw new ValidationError(`status must be one of: ${ALLOWED_STATUSES.join(', ')}`)
  }

  next()
}

module.exports = { validateCreateProperty, validateUpdateStatus }
