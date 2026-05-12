const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'users ok' })
})

module.exports = router