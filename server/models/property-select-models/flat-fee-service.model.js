import mongoose from 'mongoose'

const propertyFlatFeeServiceSchema = new mongoose.Schema(
  {
    value: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model(
  'PropertyFlatFeeService',
  propertyFlatFeeServiceSchema
)
