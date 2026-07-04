const express = require('express')
const router = express.Router()
const faqController = require('../controllers/faq.controller')
const { validateCreateFaq, validateUpdateFaq } = require('../validators/faq.validator')

/**
 * @swagger
 * tags:
 *   name: Faqs
 *   description: Frequently asked questions
 */

/**
 * @swagger
 * /faqs:
 *   get:
 *     summary: List all FAQs
 *     tags: [Faqs]
 *     responses:
 *       200:
 *         description: List of FAQs
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/', faqController.listFaqs)

/**
 * @swagger
 * /faqs/{id}:
 *   get:
 *     summary: Get a FAQ by ID
 *     tags: [Faqs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: FAQ found
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/:id', faqController.getFaq)

/**
 * @swagger
 * /faqs:
 *   post:
 *     summary: Create a FAQ
 *     tags: [Faqs]
 *     responses:
 *       201:
 *         description: FAQ created
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/', validateCreateFaq, faqController.createFaq)

/**
 * @swagger
 * /faqs/{id}:
 *   put:
 *     summary: Update a FAQ
 *     tags: [Faqs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: FAQ updated
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.put('/:id', validateUpdateFaq, faqController.updateFaq)

/**
 * @swagger
 * /faqs/{id}:
 *   delete:
 *     summary: Delete a FAQ
 *     tags: [Faqs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: FAQ deleted
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.delete('/:id', faqController.deleteFaq)

module.exports = router
