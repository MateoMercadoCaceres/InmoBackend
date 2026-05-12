const mediaRepository = require('../repositories/media.repository')
const propertyRepository = require('../repositories/property.repository')
const NotFoundError = require('../errors/NotFoundError')

async function getMediaByProperty(property_id) {
  const property = await propertyRepository.findById(property_id)
  if (!property) throw new NotFoundError(`Property ${property_id} not found`)
  return mediaRepository.findByProperty(property_id)
}

async function addMedia(payload) {
  const property = await propertyRepository.findById(payload.property_id)
  if (!property) throw new NotFoundError(`Property ${payload.property_id} not found`)
  return mediaRepository.create(payload)
}

async function removeMedia(id) {
  await mediaRepository.remove(id)
}

module.exports = { getMediaByProperty, addMedia, removeMedia }
