const propertyRepository = require('../repositories/property.repository')
const statusRepository = require('../repositories/status.repository')
const { ALLOWED_STATUSES } = require('../constants/propertyStatuses')
const NotFoundError = require('../errors/NotFoundError')
const ValidationError = require('../errors/ValidationError')
const { parsePagination } = require('../utils/pagination')

async function listProperties(query) {
  const { page, limit, offset } = parsePagination(query)

  const filters = {
    availability_status: query.availability_status,
    type_id: query.type_id,
    priority: query.priority,
    capturing_agent: query.capturing_agent,
    selling_agent: query.selling_agent
  }

  const { data, count } = await propertyRepository.findAll({ limit, offset, filters })
  return { data, meta: { page, limit, total: count } }
}

async function getProperty(id) {
  const property = await propertyRepository.findById(id)
  if (!property) throw new NotFoundError(`Property ${id} not found`)
  return property
}

async function createProperty(payload) {
  return propertyRepository.create(payload)
}

async function updateProperty(id, payload) {
  await getProperty(id)
  return propertyRepository.update(id, payload)
}

async function updatePropertyStatus(id, { status, user_id }) {
  if (!ALLOWED_STATUSES.includes(status)) {
    throw new ValidationError(`Invalid status: ${status}`)
  }

  const property = await getProperty(id)
  const old_status = property.availability_status

  if (old_status === status) return property

  const updated = await propertyRepository.update(id, { availability_status: status })

  await statusRepository.logStatusChange({ property_id: id, user_id, old_status, new_status: status })

  return updated
}

async function deleteProperty(id) {
  await getProperty(id)
  await propertyRepository.remove(id)
}

module.exports = {
  listProperties,
  getProperty,
  createProperty,
  updateProperty,
  updatePropertyStatus,
  deleteProperty
}
