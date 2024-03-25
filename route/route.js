const express = require('express')
const router = express.Router()

const controlRoute = require('./route_control')

router.use(controlRoute)

module.exports = router