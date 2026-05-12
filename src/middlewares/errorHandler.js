const AppError = require('../errors/AppError')

function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    })
  }

  console.error('[Unhandled Error]', err)

  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  })
}

module.exports = { errorHandler }
