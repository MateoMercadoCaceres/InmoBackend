const ValidationError = require('../errors/ValidationError')

function validateCreateCategory(req, res, next) {
  const { label } = req.body
  if (!label || !String(label).trim()) throw new ValidationError('label is required')
  next()
}

function validateRenameCategory(req, res, next) {
  const { label } = req.body
  if (!label || !String(label).trim()) throw new ValidationError('label is required')
  next()
}

module.exports = { validateCreateCategory, validateRenameCategory }
