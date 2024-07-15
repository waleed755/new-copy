import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    companyName: {
      type: String,
    },
    accountId: {
      type: String,
    },
    customerRandomId: {
      type: Number,
    },
    accountName: {
      type: String,
      required: true,
    },
    accountStatus: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PropertyStatus',
      },
      value: {
        type: String,
      },
    },
    accountBranch: {
      type: String,
      required: true,
    },
    branchRandomId: {
      type: String,
    },
    accountAddress: {
      type: String,
    },
    accountContact: {
      type: String,
    },
    accountEmail: {
      type: String,
    },
    accountCreatedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accountCreatedByUserName: {
      type: String,
      required: true,
    },
    accountNotes: {
      type: String,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Customer', customerSchema)
