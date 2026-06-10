const driveMediaService = require('../services/driveMedia.service')
const asyncHandler = require('../utils/asyncHandler')
const { sendSuccess } = require('../utils/response')
const ValidationError = require('../errors/ValidationError')
const { ALLOWED_MEDIA_TYPES } = require('../constants/mediaTypes')

const createFolder = asyncHandler(async (req, res) => {
  const { name, parentFolderId } = req.body
  if (!name) throw new ValidationError('name is required')

  const folder = await driveMediaService.createFolder(name, parentFolderId)
  sendSuccess(res, folder, 201)
})

const listFolderFiles = asyncHandler(async (req, res) => {
  const files = await driveMediaService.listFolder(req.params.folderId)
  sendSuccess(res, files)
})

const uploadMedia = asyncHandler(async (req, res) => {
  const { property_id, media_type } = req.body
  if (!property_id) throw new ValidationError('property_id is required')
  if (!media_type) throw new ValidationError('media_type is required')
  if (!ALLOWED_MEDIA_TYPES.includes(media_type)) {
    throw new ValidationError(`media_type must be one of: ${ALLOWED_MEDIA_TYPES.join(', ')}`)
  }
  if (!req.files || req.files.length === 0) throw new ValidationError('At least one file is required')

  const result = await driveMediaService.uploadMedia(
    req.params.folderId,
    req.files,
    property_id,
    media_type
  )
  sendSuccess(res, result, 201)
})

const uploadRaw = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) throw new ValidationError('At least one file is required')

  const result = await driveMediaService.uploadRaw(req.params.folderId, req.files)
  sendSuccess(res, result, 201)
})

const deleteMedia = asyncHandler(async (req, res) => {
  await driveMediaService.deleteMedia(req.params.mediaId)
  res.status(204).send()
})

const downloadFile = asyncHandler(async (req, res) => {
  const { stream, name, mimeType } = await driveMediaService.getFileStream(req.params.fileId)
  res.setHeader('Content-Disposition', `attachment; filename="${name}"`)
  res.setHeader('Content-Type', mimeType)
  stream.pipe(res)
})

const downloadFolder = asyncHandler(async (req, res) => {
  const { stream, name } = await driveMediaService.createFolderZipStream(req.params.folderId)
  res.setHeader('Content-Disposition', `attachment; filename="${name}.zip"`)
  res.setHeader('Content-Type', 'application/zip')
  stream.on('error', err => {
    if (!res.headersSent) res.status(500).json({ success: false, message: err.message })
    else res.end()
  })
  stream.pipe(res)
})

module.exports = {
  createFolder,
  listFolderFiles,
  uploadMedia,
  uploadRaw,
  deleteMedia,
  downloadFile,
  downloadFolder
}
