const mongoose = require('mongoose')

const SongSchema = new mongoose.Schema({
   artist: {
      type: mongoose.SchemaTypes.String,
      required: [true, 'Nazwa wykonawcy jest wymagana'],
   },
   title: {
      type: mongoose.SchemaTypes.String,
      required: [true, 'Tytuł jest wymagany'],
   },
   filename: {
      type: mongoose.SchemaTypes.String,
      required: [true, 'Nazwa pliku jest wymagana'],
   },
   createdDate: {
      type: mongoose.SchemaTypes.Date,
      required: true,
      default: Date.now(),
   },
})

module.exports = mongoose.model('Songs', SongSchema)
