const express = require('express')
const router = express.Router()

router.use('/', require('./assignment.routes'))

module.exports = router