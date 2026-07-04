const express = require('express')
const router = express.Router()
const faqCategoryController = require('../controllers/faqCategory.controller')
const {
  validateCreateCategory,
  validateRenameCategory,
} = require('../validators/faqCategory.validator')

/**
 * @swagger
 * tags:
 *   name: FaqCategories
 *   description: FAQ category management
 */

/**
 * @swagger
 * /faq-categories:
 *   get:
 *     summary: List all FAQ categories
 *     tags: [FaqCategories]
 *     responses:
 *       200:
 *         description: List of categories
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/', faqCategoryController.listCategories)

/**
 * @swagger
 * /faq-categories:
 *   post:
 *     summary: Create a FAQ category
 *     tags: [FaqCategories]
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/', validateCreateCategory, faqCategoryController.createCategory)

/**
 * @swagger
 * /faq-categories/{id}:
 *   put:
 *     summary: Rename a FAQ category (cascades to its FAQs)
 *     tags: [FaqCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Category renamed
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.put('/:id', validateRenameCategory, faqCategoryController.renameCategory)

/**
 * @swagger
 * /faq-categories/{id}:
 *   delete:
 *     summary: Delete a FAQ category (only if it has no questions)
 *     tags: [FaqCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Category deleted
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.delete('/:id', faqCategoryController.deleteCategory)

module.exports = router
