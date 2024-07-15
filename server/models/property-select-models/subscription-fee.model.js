import mongoose from 'mongoose'

const propertySubscriptionFeeSchema = new mongoose.Schema(
  {
    value: {
      type: String
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model(
  'PropertySubscriptionFee',
  propertySubscriptionFeeSchema
)
