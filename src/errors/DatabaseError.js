const AppError = require('./AppError')

class DatabaseError extends AppError {
  constructor(message = 'Database error') {
    super(message, 500)
  }
}

module.exports = DatabaseError
