const express = require('express')
const router = express.Router()

router.use('/properties', require('./property.routes'))
router.use('/media', require('./media.routes'))
router.use('/users', require('./user.routes'))

module.exports = router
