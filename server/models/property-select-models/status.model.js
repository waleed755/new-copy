import mongoose from 'mongoose'

const propertyStatusSchema = new mongoose.Schema(
  {
    value: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('PropertyStatus', propertyStatusSchema)
