import mongoose from 'mongoose'

const propertyKeysSchema = new mongoose.Schema(
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

export default mongoose.model('PropertyKeys', propertyKeysSchema)