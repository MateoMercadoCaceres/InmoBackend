const faqCategoryService = require('../services/faqCategory.service')
const asyncHandler = require('../utils/asyncHandler')
const { sendSuccess } = require('../utils/response')

const listCategories = asyncHandler(async (req, res) => {
  const categories = await faqCategoryService.listCategories()
  sendSuccess(res, categories)
})

const createCategory = asyncHandler(async (req, res) => {
  const category = await faqCategoryService.createCategory(req.body)
  sendSuccess(res, category, 201)
})

const renameCategory = asyncHandler(async (req, res) => {
  const category = await faqCategoryService.renameCategory(req.params.id, req.body.label)
  sendSuccess(res, category)
})

const deleteCategory = asyncHandler(async (req, res) => {
  await faqCategoryService.deleteCategory(req.params.id)
  res.status(204).send()
})

module.exports = { listCategories, createCategory, renameCategory, deleteCategory }
