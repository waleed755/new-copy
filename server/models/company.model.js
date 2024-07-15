import mongoose from 'mongoose'

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    industry: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
    },
    city: {
      type: String,
    },
    postCode: {
      type: String,
    },
    country: {
      type: String,
    },
    timeZone: {
      type: String,
    },
    currency: {
      type: String,
    },
    companyLogo: {
      type: String,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Company', companySchema)
