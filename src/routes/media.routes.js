const express = require('express')
const router = express.Router()
const mediaController = require('../controllers/media.controller')
const { validateCreateMedia } = require('../validators/media.validator')

/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Property media (photos and videos)
 */

/**
 * @swagger
 * /media/property/{propertyId}:
 *   get:
 *     summary: Get all media for a property
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: List of media items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Media' }
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/property/:propertyId', mediaController.getMediaByProperty)

/**
 * @swagger
 * /media:
 *   post:
 *     summary: Add media to a property
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MediaInput' }
 *     responses:
 *       201:
 *         description: Media added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Media' }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/', validateCreateMedia, mediaController.addMedia)

/**
 * @swagger
 * /media/{id}:
 *   delete:
 *     summary: Delete a media item
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204:
 *         description: Media deleted
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.delete('/:id', mediaController.removeMedia)

module.exports = router
