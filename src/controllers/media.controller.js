const mediaService = require('../services/media.service')
const asyncHandler = require('../utils/asyncHandler')
const { sendSuccess } = require('../utils/response')

const getMediaByProperty = asyncHandler(async (req, res) => {
  const media = await mediaService.getMediaByProperty(req.params.propertyId)
  sendSuccess(res, media)
})

const addMedia = asyncHandler(async (req, res) => {
  const media = await mediaService.addMedia(req.body)
  sendSuccess(res, media, 201)
})

const removeMedia = asyncHandler(async (req, res) => {
  await mediaService.removeMedia(req.params.id)
  res.status(204).send()
})

module.exports = { getMediaByProperty, addMedia, removeMedia }
