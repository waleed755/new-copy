import mongoose from 'mongoose'

const chargeAbleSchema = new mongoose.Schema(
  {
    value: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('PropertyChargeAble', chargeAbleSchema)

