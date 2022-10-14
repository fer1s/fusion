const router = require('express').Router()
const path = require('path')

router.get('/', (req, res) => {
   res.sendFile(path.resolve('index.html'))
})
router.use('/stream', require('./stream'))

module.exports = router
