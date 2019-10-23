const express = require('express')
const router = express.Router()

// @route   GET api/users/test
// desc     Tests users route
// access   Pulic
router.get('/test', (req, res) => res.json({msg: 'users works'}))


module.exports = router