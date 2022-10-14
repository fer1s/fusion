const youtubeDownloader = require('youtube-mp3-downloader')
const SongSchema = require('./database/schemas/Song')
const shell = require('shelljs')
const path = require('path')

const devices = []
let activeDeviceID

const ffmpegPath = shell.which('ffmpeg')

const notification = (socket, title, description, accent) => {
   if (!accent) accent = '#fcbc0e'
   socket.emit('notification', {
      title,
      description,
      accent,
   })
}

const update = async (socket) => {
   socket.emit('devices_data', devices)
   socket.broadcast.emit('devices_data', devices)
}
const addDevice = (id, socket) => {
   devices.push(id)
}
const removeDevice = (id, socket) => {
   devices.splice(devices.indexOf(id), 1)
}


io.on('connection', (socket) => {

   socket.name = socket.id
   socket.on('device_connected', (device_name) => {
      socket.name = device_name
      addDevice(socket.name, socket)
      update(socket)
   })
   socket.on('disconnect', () => {
      removeDevice(socket.name, socket)
      update(socket)
   })
   socket.on('set_devicename', (device_name) =>{
      removeDevice(socket.name, socket)
      socket.name = device_name
      addDevice(socket.name, socket)
      update(socket)
   })

   socket.on('download_youtube', (link) => {
      const YD = new youtubeDownloader({
         ffmpegPath: ffmpegPath.stdout,
         outputPath: path.resolve('songs'),
         youtubeVideoQuality: 'highestaudio',
      })

      YD.download(link)

      YD.on('finished', async (err, data) => {
         const newSong = new SongSchema({
            artist: data.artist,
            title: data.title,
            filename: path.basename(data.file),
         })
         await newSong.save()
         const songs = await SongSchema.find();

         await socket.emit('songs_list', songs);
         await socket.broadcast.emit('songs_list', songs);
         notification(socket, 'Success', 'Downloaded new song from YouTube!', '#19b459')
      })

      YD.on('error', (err) => {
         console.log(err)
         notification(socket, 'Error', 'Some error.', '#f54242')
      })

      YD.on('progress', function (progress) {
         socket.emit('download_progress', progress.progress.percentage)
      })
   })

   socket.on('play_song', async (song) => {
      console.log(song)
      if (!song) return
      const findSong = await SongSchema.findOne({ $or: [{ _id: song }, { title: song }, { filename: song }] })
      if (!findSong) return console.log('Song not found!')

      socket.emit('song', {
         id: findSong._id,
         title: findSong.title,
         artist: findSong.artist,
      })
   })

   socket.on('fetch_songs', async() => {
      const songs = await SongSchema.find();

      await socket.emit('songs_list', songs);
   })

   socket.on('next_song', async (act_song) => {
      let next = await SongSchema.findOne({_id: {$gt: act_song}}).sort({_id: 1}).limit(1)
      if(!next) return;
      const nextID = await next.get('_id').toString();

      socket.emit('song', {
         id: nextID,
         title: next.title,
         artist: next.artist
      })
   })

   socket.on('previous_song', async (act_song) => {
      const previous = await SongSchema.findOne({_id: {$lt: act_song}}).sort({_id: -1}).limit(1)
      if(!previous) return;
      const prevID = await previous.get('_id').toString();

      socket.emit('song', {
         id: prevID,
         title: previous.title,
         artist: previous.artist
      })
   })
})
