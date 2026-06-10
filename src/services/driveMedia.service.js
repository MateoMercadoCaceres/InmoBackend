const { Readable } = require('stream')
const archiver = require('archiver')
const { getDriveClient } = require('./driveClient')
const mediaRepository = require('../repositories/media.repository')
const propertyRepository = require('../repositories/property.repository')
const NotFoundError = require('../errors/NotFoundError')
const AppError = require('../errors/AppError')

const FOLDER_MIME = 'application/vnd.google-apps.folder'

async function createFolder(name, parentFolderId) {
  const drive = await getDriveClient()
  const meta = { name, mimeType: FOLDER_MIME }
  if (parentFolderId) meta.parents = [parentFolderId]

  const { data } = await drive.files.create({
    requestBody: meta,
    fields: 'id, name, webViewLink'
  })
  return data
}

async function listFolder(folderId) {
  const drive = await getDriveClient()
  const { data } = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType, webViewLink, webContentLink, size, createdTime)',
    orderBy: 'createdTime desc'
  })
  return data.files
}

async function uploadMedia(folderId, files, property_id, media_type) {
  const property = await propertyRepository.findById(property_id)
  if (!property) throw new NotFoundError(`Property ${property_id} not found`)

  const drive = await getDriveClient()
  const results = []

  for (const file of files) {
    const { data: driveFile } = await drive.files.create({
      requestBody: { name: file.originalname, parents: [folderId] },
      media: { mimeType: file.mimetype, body: Readable.from(file.buffer) },
      fields: 'id, name, webViewLink, webContentLink, size'
    })

    const record = await mediaRepository.create({
      property_id,
      media_type,
      media_folder_url: driveFile.webViewLink
    })

    results.push({ ...record, drive_file_id: driveFile.id })
  }

  return results
}

// Uploads files to a Drive folder WITHOUT creating property_media records.
// Used for assets not tied to a property (e.g. advisor profile photos).
async function uploadRaw(folderId, files) {
  const drive = await getDriveClient()
  const results = []

  for (const file of files) {
    const { data: driveFile } = await drive.files.create({
      requestBody: { name: file.originalname, parents: [folderId] },
      media: { mimeType: file.mimetype, body: Readable.from(file.buffer) },
      fields: 'id, name, webViewLink, webContentLink, size'
    })

    results.push({
      drive_file_id: driveFile.id,
      name: driveFile.name,
      media_folder_url: driveFile.webViewLink
    })
  }

  return results
}

function extractFileId(url) {
  const match = url.match(/\/file\/d\/([^/]+)\//)
  if (!match) throw new AppError(`Cannot extract Drive file ID from URL: ${url}`, 400)
  return match[1]
}

async function deleteMedia(mediaId) {
  const record = await mediaRepository.findById(mediaId)
  if (!record) throw new NotFoundError(`Media record ${mediaId} not found`)

  const fileId = extractFileId(record.media_folder_url)
  const drive = await getDriveClient()

  try {
    await drive.files.delete({ fileId })
  } catch (err) {
    // file already deleted or inaccessible — still clean up Supabase row
    if (err.code !== 404 && err.status !== 404) throw err
  }

  await mediaRepository.remove(mediaId)
}

async function getFileStream(fileId) {
  const drive = await getDriveClient()

  const { data: meta } = await drive.files.get({
    fileId,
    fields: 'name, mimeType'
  })

  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  )

  return { stream: response.data, name: meta.name, mimeType: meta.mimeType }
}

async function createFolderZipStream(folderId) {
  const drive = await getDriveClient()
  const [files, folderMeta] = await Promise.all([
    listFolder(folderId),
    drive.files.get({ fileId: folderId, fields: 'name' }).then(r => r.data)
  ])

  const archive = archiver('zip', { zlib: { level: 5 } })

  ;(async () => {
    for (const file of files) {
      if (file.mimeType === FOLDER_MIME) continue
      const fileRes = await drive.files.get(
        { fileId: file.id, alt: 'media' },
        { responseType: 'stream' }
      )
      archive.append(fileRes.data, { name: file.name })
    }
    archive.finalize()
  })().catch(err => archive.emit('error', err))

  return { stream: archive, name: folderMeta.name }
}

module.exports = {
  createFolder,
  listFolder,
  uploadMedia,
  uploadRaw,
  deleteMedia,
  getFileStream,
  createFolderZipStream
}
