const faqCategoryRepository = require('../repositories/faqCategory.repository')
const faqRepository = require('../repositories/faq.repository')
const NotFoundError = require('../errors/NotFoundError')
const ValidationError = require('../errors/ValidationError')

async function listCategories() {
  return faqCategoryRepository.findAll()
}

async function getCategory(id) {
  const category = await faqCategoryRepository.findById(id)
  if (!category) throw new NotFoundError(`Faq category ${id} not found`)
  return category
}

async function createCategory({ label }) {
  const trimmed = label.trim()
  const existing = await faqCategoryRepository.findByLabel(trimmed)
  if (existing) throw new ValidationError(`Category "${trimmed}" already exists`)

  const order_index = await faqCategoryRepository.countAll()
  return faqCategoryRepository.create({ label: trimmed, order_index })
}

async function renameCategory(id, label) {
  const category = await getCategory(id)
  const trimmed = label.trim()

  const existing = await faqCategoryRepository.findByLabel(trimmed)
  if (existing && String(existing.id) !== String(id)) {
    throw new ValidationError(`Category "${trimmed}" already exists`)
  }

  const updated = await faqCategoryRepository.update(id, { label: trimmed })
  if (trimmed !== category.label) {
    await faqRepository.updateCategoryLabel(category.label, trimmed)
  }
  return updated
}

async function deleteCategory(id) {
  const category = await getCategory(id)
  const questionCount = await faqRepository.countByCategory(category.label)
  if (questionCount > 0) {
    throw new ValidationError(
      `Category "${category.label}" has ${questionCount} question(s). Delete or move them before removing the category.`
    )
  }
  await faqCategoryRepository.remove(id)
}

module.exports = { listCategories, getCategory, createCategory, renameCategory, deleteCategory }
