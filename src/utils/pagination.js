const { PAGINATION } = require('../constants/pagination')

function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page) || PAGINATION.DEFAULT_PAGE)
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT)
  )
  const offset = (page - 1) * limit
  return { page, limit, offset }
}

module.exports = { parsePagination }
