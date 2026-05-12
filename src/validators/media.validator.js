const { ALLOWED_MEDIA_TYPES } = require('../constants/mediaTypes')
const ValidationError = require('../errors/ValidationError')

function validateCreateMedia(req, res, next) {
  const { property_id, media_type, media_folder_url } = req.body

  if (!property_id) throw new ValidationError('property_id is required')
  if (!media_type) throw new ValidationError('media_type is required')
  if (!ALLOWED_MEDIA_TYPES.includes(media_type)) {
    throw new ValidationError(`media_type must be one of: ${ALLOWED_MEDIA_TYPES.join(', ')}`)
  }
  if (!media_folder_url) throw new ValidationError('media_folder_url is required')

  next()
}

module.exports = { validateCreateMedia }
