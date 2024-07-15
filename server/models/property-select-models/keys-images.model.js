import mongoose from 'mongoose'

const keyImageSchema = new mongoose.Schema(
  {
    uploadedFiles: {
      type: [],
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
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

export default mongoose.model('keyImage', keyImageSchema)
