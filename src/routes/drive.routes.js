const express = require('express')
const multer = require('multer')
const router = express.Router()
const driveController = require('../controllers/drive.controller')
const driveMediaController = require('../controllers/driveMedia.controller')

const upload = multer({ storage: multer.memoryStorage() })

/**
 * @swagger
 * tags:
 *   name: Drive
 *   description: Google Drive OAuth2 connection and media management
 */

/**
 * @swagger
 * /admin/drive/auth:
 *   get:
 *     summary: Redirect admin to Google OAuth2 consent screen
 *     tags: [Drive]
 *     responses:
 *       302:
 *         description: Redirect to Google consent screen
 */
router.get('/auth', driveController.redirectToGoogleAuth)

/**
 * @swagger
 * /admin/drive/callback:
 *   get:
 *     summary: Handle Google OAuth2 callback and store tokens
 *     tags: [Drive]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Drive connected successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       502:
 *         description: Google token exchange failed
 */
router.get('/callback', driveController.handleOAuthCallback)

/**
 * @swagger
 * /admin/drive/folders:
 *   post:
 *     summary: Create a folder in Google Drive
 *     tags: [Drive]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "Property 42" }
 *               parentFolderId: { type: string, example: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs" }
 *     responses:
 *       201:
 *         description: Folder created
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/folders', driveMediaController.createFolder)

/**
 * @swagger
 * /admin/drive/folders/{folderId}:
 *   get:
 *     summary: List all files in a Drive folder
 *     tags: [Drive]
 *     parameters:
 *       - in: path
 *         name: folderId
 *         required: true
 *         schema: { type: string }
 *         description: Google Drive folder ID
 *     responses:
 *       200:
 *         description: List of files in the folder
 */
router.get('/folders/:folderId', driveMediaController.listFolderFiles)

/**
 * @swagger
 * /admin/drive/folders/{folderId}/upload:
 *   post:
 *     summary: Upload photos or videos to a Drive folder and save records to property_media
 *     tags: [Drive]
 *     parameters:
 *       - in: path
 *         name: folderId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [files, property_id, media_type]
 *             properties:
 *               files:
 *                 type: array
 *                 items: { type: string, format: binary }
 *               property_id:
 *                 type: integer
 *               media_type:
 *                 type: string
 *                 enum: [photo, video]
 *     responses:
 *       201:
 *         description: Files uploaded and media records created
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/folders/:folderId/upload', upload.array('files', 20), driveMediaController.uploadMedia)

/**
 * @swagger
 * /admin/drive/folders/{folderId}/upload-raw:
 *   post:
 *     summary: Upload files to a Drive folder WITHOUT creating property_media records (e.g. advisor photos)
 *     tags: [Drive]
 *     parameters:
 *       - in: path
 *         name: folderId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [files]
 *             properties:
 *               files:
 *                 type: array
 *                 items: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Files uploaded; returns drive_file_id per file
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/folders/:folderId/upload-raw', upload.array('files', 20), driveMediaController.uploadRaw)

/**
 * @swagger
 * /admin/drive/media/{mediaId}:
 *   delete:
 *     summary: Delete a media item from Drive and from property_media
 *     tags: [Drive]
 *     parameters:
 *       - in: path
 *         name: mediaId
 *         required: true
 *         schema: { type: integer }
 *         description: property_media row ID
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/media/:mediaId', driveMediaController.deleteMedia)

/**
 * @swagger
 * /admin/drive/files/{fileId}:
 *   delete:
 *     summary: Delete a file directly from Drive by its Drive file ID
 *     description: >
 *       Also removes the matching property_media row if one exists. Intended for the
 *       folder gallery UI, which only has Drive file IDs (not property_media row IDs).
 *     tags: [Drive]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema: { type: string }
 *         description: Google Drive file ID
 *     responses:
 *       204:
 *         description: Deleted
 */
router.delete('/files/:fileId', driveMediaController.deleteFile)

/**
 * @swagger
 * /admin/drive/files/{fileId}/download:
 *   get:
 *     summary: Download a single file from Drive
 *     tags: [Drive]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema: { type: string }
 *         description: Google Drive file ID
 *     responses:
 *       200:
 *         description: File stream
 *         content:
 *           application/octet-stream: {}
 */
router.get('/files/:fileId/download', driveMediaController.downloadFile)

/**
 * @swagger
 * /admin/drive/files/{fileId}/view:
 *   get:
 *     summary: Render a cached, resized version of a file for inline display
 *     description: >
 *       Serves Google Drive's pre-resized thumbnail (falling back to the full file when
 *       no thumbnail exists) with long-lived Cache-Control/ETag headers, so browsers and
 *       Next's image optimizer don't re-fetch Drive on every render. Intended as the
 *       source for <img>/next/image tags — use /download for actual file downloads.
 *     tags: [Drive]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema: { type: string }
 *         description: Google Drive file ID
 *       - in: query
 *         name: size
 *         schema: { type: integer, default: 400, minimum: 100, maximum: 2000 }
 *         description: Target longest-edge size in pixels
 *     responses:
 *       200:
 *         description: Image stream
 *         content:
 *           image/*: {}
 *       304:
 *         description: Not modified (client's cached copy is still valid)
 */
router.get('/files/:fileId/view', driveMediaController.viewThumbnail)

/**
 * @swagger
 * /admin/drive/folders/{folderId}/download:
 *   get:
 *     summary: Download an entire Drive folder as a ZIP archive
 *     tags: [Drive]
 *     parameters:
 *       - in: path
 *         name: folderId
 *         required: true
 *         schema: { type: string }
 *         description: Google Drive folder ID
 *     responses:
 *       200:
 *         description: ZIP stream of all files in the folder
 *         content:
 *           application/zip: {}
 */
router.get('/folders/:folderId/download', driveMediaController.downloadFolder)

module.exports = router
