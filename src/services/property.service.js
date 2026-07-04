const propertyRepository = require('../repositories/property.repository')
const statusRepository = require('../repositories/status.repository')
const propertyDriveFoldersRepository = require('../repositories/propertyDriveFolders.repository')
const mediaRepository = require('../repositories/media.repository')
const driveMediaService = require('./driveMedia.service')
const { ALLOWED_STATUSES } = require('../constants/propertyStatuses')
const NotFoundError = require('../errors/NotFoundError')
const ValidationError = require('../errors/ValidationError')
const { parsePagination } = require('../utils/pagination')
const { buildSlugAssignments } = require('../utils/propertySlug')

async function attachSlugs(properties) {
  const rows = await propertyRepository.findAllTitles()
  const { idToSlug } = buildSlugAssignments(rows)
  return properties.map((p) => ({ ...p, slug: idToSlug.get(p.id) }))
}

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

  const folders = await propertyDriveFoldersRepository.findByProperties(data.map((p) => p.id))
  const foldersByProperty = new Map(folders.map((f) => [f.property_id, f]))
  const withDriveFolders = data.map((p) => ({ ...p, drive_folders: foldersByProperty.get(p.id) ?? null }))
  const withSlugs = await attachSlugs(withDriveFolders)

  return { data: withSlugs, meta: { page, limit, total: count } }
}

async function getProperty(id) {
  const property = await propertyRepository.findById(id)
  if (!property) throw new NotFoundError(`Property ${id} not found`)

  const drive_folders = await propertyDriveFoldersRepository.findByProperty(id)
  return { ...property, drive_folders }
}

async function getPropertyBySlug(slug) {
  const property = await propertyRepository.findBySlug(slug)
  if (!property) throw new NotFoundError(`Property with slug "${slug}" not found`)

  const drive_folders = await propertyDriveFoldersRepository.findByProperty(property.id)
  return { ...property, drive_folders, slug }
}

async function createProperty(payload) {
  const property = await propertyRepository.create(payload)

  try {
    const rootFolder = await driveMediaService.createFolder(
      `${property.id} - ${property.title}`,
      process.env.PROPERTIES_ROOT_FOLDER_ID
    )

    const [artsFolder, imgFolder] = await Promise.all([
      driveMediaService.createFolder('artes', rootFolder.id),
      driveMediaService.createFolder('img', rootFolder.id)
    ])

    const drive_folders = await propertyDriveFoldersRepository.create({
      property_id: property.id,
      drive_folder_id: rootFolder.id,
      arts_folder_id: artsFolder.id,
      img_folder_id: imgFolder.id
    })

    const [withSlug] = await attachSlugs([{ ...property, drive_folders }])
    return withSlug
  } catch (err) {
    await propertyRepository.remove(property.id)
    throw err
  }
}

async function ensureDriveFolders(id) {
  const property = await propertyRepository.findById(id)
  if (!property) throw new NotFoundError(`Property ${id} not found`)

  const existing = await propertyDriveFoldersRepository.findByProperty(id)
  if (existing) return existing

  const rootFolder = await driveMediaService.createFolder(
    `${property.id} - ${property.title}`,
    process.env.PROPERTIES_ROOT_FOLDER_ID
  )

  const [artsFolder, imgFolder] = await Promise.all([
    driveMediaService.createFolder('artes', rootFolder.id),
    driveMediaService.createFolder('img', rootFolder.id)
  ])

  return propertyDriveFoldersRepository.create({
    property_id: property.id,
    drive_folder_id: rootFolder.id,
    arts_folder_id: artsFolder.id,
    img_folder_id: imgFolder.id
  })
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

  await Promise.all([
    mediaRepository.removeByProperty(id),
    statusRepository.removeByProperty(id),
    propertyDriveFoldersRepository.removeByProperty(id)
  ])

  await propertyRepository.remove(id)
}

module.exports = {
  listProperties,
  getProperty,
  getPropertyBySlug,
  createProperty,
  ensureDriveFolders,
  updateProperty,
  updatePropertyStatus,
  deleteProperty
}
