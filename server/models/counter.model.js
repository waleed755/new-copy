import mongoose from 'mongoose'

const counterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: Number,
    required: true,
  },
})

export default mongoose.model('Counter', counterSchema)
