const SongSchema = require('../database/schemas/Song')
const router = require('express').Router()
const path = require('path')
const fs = require('fs')

router.get('/song/:id', async (req, res) => {
   const id = req.params.id
   const songsDir = path.resolve('songs')
   const findSong = await SongSchema.findOne({ _id: id })
   if (!findSong) return res.json({ status: 'error', message: 'Song not found!' })

   let songFile = findSong.filename
   songFile = path.join(songsDir, songFile)

   const stat = fs.statSync(songFile)
   const range = req.headers.range
   let readStream

   if (range !== undefined) {
      const parts = range.replace(/bytes=/, '').split('-')

      const partialStart = parts[0]
      const partialEnd = parts[1]

      if ((isNaN(partialStart) && partialStart.length > 1) || (isNaN(partialEnd) && partialEnd.length > 1)) {
         return res.sendStatus(500)
      }

      const start = parseInt(partialStart, 10)
      const end = partialEnd ? parseInt(partialEnd, 10) : stat.size - 1
      const contentLength = end - start + 1

      res.status(206).header({
         'Content-Type': 'audio/mpeg',
         'Content-Length': contentLength,
         'Content-Range': 'bytes ' + start + '-' + end + '/' + stat.size,
      })

      readStream = fs.createReadStream(songFile, {
         start: start,
         end: end,
      })
   } else {
      res.header({
         'Content-Type': 'audio/mpeg',
         'Content-Length': stat.size,
      })
      readStream = fs.createReadStream(songFile)
   }
   readStream.pipe(res);
})

module.exports = router
