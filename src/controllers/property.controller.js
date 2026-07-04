const propertyService = require('../services/property.service')
const asyncHandler = require('../utils/asyncHandler')
const { sendSuccess } = require('../utils/response')

const listProperties = asyncHandler(async (req, res) => {
  const result = await propertyService.listProperties(req.query)
  sendSuccess(res, result)
})

const getProperty = asyncHandler(async (req, res) => {
  const { id } = req.params
  const property = /^\d+$/.test(id)
    ? await propertyService.getProperty(id)
    : await propertyService.getPropertyBySlug(id)
  sendSuccess(res, property)
})

const createProperty = asyncHandler(async (req, res) => {
  const property = await propertyService.createProperty(req.body)
  sendSuccess(res, property, 201)
})

const ensureDriveFolders = asyncHandler(async (req, res) => {
  const driveFolders = await propertyService.ensureDriveFolders(req.params.id)
  sendSuccess(res, driveFolders)
})

const updateProperty = asyncHandler(async (req, res) => {
  const property = await propertyService.updateProperty(req.params.id, req.body)
  sendSuccess(res, property)
})

const updatePropertyStatus = asyncHandler(async (req, res) => {
  const property = await propertyService.updatePropertyStatus(req.params.id, req.body)
  sendSuccess(res, property)
})

const deleteProperty = asyncHandler(async (req, res) => {
  await propertyService.deleteProperty(req.params.id)
  res.status(204).send()
})

module.exports = {
  listProperties,
  getProperty,
  createProperty,
  ensureDriveFolders,
  updateProperty,
  updatePropertyStatus,
  deleteProperty
}
