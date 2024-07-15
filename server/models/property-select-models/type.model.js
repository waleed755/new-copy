import mongoose from 'mongoose'

const propertyTypeSchema = new mongoose.Schema(
  {
    value: {
      type: String,
    },
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdByUserName: {
      type: String,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    companyName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('PropertyType', propertyTypeSchema)
