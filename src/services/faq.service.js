const faqRepository = require('../repositories/faq.repository')
const NotFoundError = require('../errors/NotFoundError')

async function listFaqs() {
  return faqRepository.findAll()
}

async function getFaq(id) {
  const faq = await faqRepository.findById(id)
  if (!faq) throw new NotFoundError(`Faq ${id} not found`)
  return faq
}

async function createFaq(payload) {
  const order_index = await faqRepository.countByCategory(payload.category)
  return faqRepository.create({ ...payload, order_index })
}

async function updateFaq(id, payload) {
  await getFaq(id)
  return faqRepository.update(id, payload)
}

async function deleteFaq(id) {
  await getFaq(id)
  await faqRepository.remove(id)
}

module.exports = { listFaqs, getFaq, createFaq, updateFaq, deleteFaq }
