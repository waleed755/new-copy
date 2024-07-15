import mongoose from 'mongoose'

const staffSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    companyName: {
      type: String,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
    },
    branchName: {
      type: String,
      required: true,
    },
    staffName: {
      type: String,
      required: true,
    },
    staffStatus: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PropertyStatus',
      },
      value: {
        type: String,
      },
    },
    staffAddress: {
      address: {
        type: String,
      },
      postCode: {
        type: String,
      },
      city: {
        type: String,
      },
    },
    staffContact: {
      type: String,
    },
    staffEmail: {
      type: String,
    },
    staffCreatedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    staffCreatedByUserName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Staff', staffSchema)
