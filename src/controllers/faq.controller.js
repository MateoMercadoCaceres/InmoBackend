const faqService = require('../services/faq.service')
const asyncHandler = require('../utils/asyncHandler')
const { sendSuccess } = require('../utils/response')

const listFaqs = asyncHandler(async (req, res) => {
  const faqs = await faqService.listFaqs()
  sendSuccess(res, faqs)
})

const getFaq = asyncHandler(async (req, res) => {
  const faq = await faqService.getFaq(req.params.id)
  sendSuccess(res, faq)
})

const createFaq = asyncHandler(async (req, res) => {
  const faq = await faqService.createFaq(req.body)
  sendSuccess(res, faq, 201)
})

const updateFaq = asyncHandler(async (req, res) => {
  const faq = await faqService.updateFaq(req.params.id, req.body)
  sendSuccess(res, faq)
})

const deleteFaq = asyncHandler(async (req, res) => {
  await faqService.deleteFaq(req.params.id)
  res.status(204).send()
})

module.exports = { listFaqs, getFaq, createFaq, updateFaq, deleteFaq }
