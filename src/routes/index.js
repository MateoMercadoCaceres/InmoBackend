const express = require('express')
const router = express.Router()

router.use('/properties', require('./property.routes'))
router.use('/media', require('./media.routes'))
router.use('/users', require('./user.routes'))
router.use('/faqs', require('./faq.routes'))
router.use('/faq-categories', require('./faqCategory.routes'))
router.use('/admin/drive', require('./drive.routes'))

module.exports = router
