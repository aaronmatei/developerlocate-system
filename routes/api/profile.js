const express = require('express')
const router = express.Router()

// @route   GET api/posts/test
// desc     Tests users route
// access   Pulic
router.get('/test', (req, res) => res.json({msg: 'Profile works'}))


module.exports = router
