import mongoose from 'mongoose'

mongoose.connection.on('connected', () => {
  console.og('da is connected')
})