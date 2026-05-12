const MEDIA_TYPES = Object.freeze({
  PHOTO: 'photo',
  VIDEO: 'video'
})

const ALLOWED_MEDIA_TYPES = Object.values(MEDIA_TYPES)

module.exports = { MEDIA_TYPES, ALLOWED_MEDIA_TYPES }
