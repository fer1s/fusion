const mongoose = require('mongoose')

mongoose
   .connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => {
      console.log('fusion | successfully connected to MongoDB!')
   })
   .catch((error) => {
      console.log('fusion | unable to connect to MongoDB!')
      console.error(error)
   })
