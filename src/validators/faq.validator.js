const ValidationError = require('../errors/ValidationError')

// Categories are free-form text (admins/editors can create new ones from the UI),
// so validation only enforces that it's a non-empty string.
function validateCreateFaq(req, res, next) {
  const { category, question, answer } = req.body

  if (!category || !String(category).trim()) throw new ValidationError('category is required')
  if (!question || !String(question).trim()) throw new ValidationError('question is required')
  if (!answer || !String(answer).trim()) throw new ValidationError('answer is required')

  next()
}

function validateUpdateFaq(req, res, next) {
  const { category, question, answer, order_index } = req.body

  if (
    category === undefined &&
    question === undefined &&
    answer === undefined &&
    order_index === undefined
  ) {
    throw new ValidationError('at least one of category, question, answer, order_index is required')
  }

  if (category !== undefined && !String(category).trim()) {
    throw new ValidationError('category cannot be empty')
  }
  if (question !== undefined && !String(question).trim()) {
    throw new ValidationError('question cannot be empty')
  }
  if (answer !== undefined && !String(answer).trim()) {
    throw new ValidationError('answer cannot be empty')
  }

  next()
}

module.exports = { validateCreateFaq, validateUpdateFaq }
