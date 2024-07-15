import mongoose from 'mongoose'

const propertyAISchema = new mongoose.Schema(
  {
    value: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('PropertyAI', propertyAISchema)
