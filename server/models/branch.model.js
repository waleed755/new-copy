import mongoose from 'mongoose'

const branchSchema = new mongoose.Schema(
  {
    branchId: {
      type: String,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    },
    customerName: {
      type: String,
      required: true,
    },
    customerRandomId: {
      type: Number,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    companyName: {
      type: String,
    },
    branchName: {
      type: String,
      required: true,
    },
    branchRandomId: {
      type: Number,
    },
    branchAddress: {
      type: String,
    },
    branchContact: {
      type: String,
    },
    branchEmail: {
      type: String,
    },
    branchCreatedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    branchCreatedByUserName: {
      type: String,
      required: true,
    },
    branchNotes: {
      type: String,
    },
    branchStatus: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PropertyStatus',
      },
      value: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Branch', branchSchema)
