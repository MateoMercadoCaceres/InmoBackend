const { ALLOWED_STATUSES } = require('../constants/propertyStatuses')
const { ALLOWED_CATEGORIES } = require('../constants/propertyCategories')
const ValidationError = require('../errors/ValidationError')

function validateCreateProperty(req, res, next) {
  const { type_id, title, availability_status, category } = req.body

  if (!type_id) throw new ValidationError('type_id is required')

  if (!title) throw new ValidationError('title is required')

  if (availability_status && !ALLOWED_STATUSES.includes(availability_status)) {
    throw new ValidationError(
      `availability_status must be one of: ${ALLOWED_STATUSES.join(', ')}`
    )
  }

  if (category && !ALLOWED_CATEGORIES.includes(category)) {
    throw new ValidationError(`category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`)
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
