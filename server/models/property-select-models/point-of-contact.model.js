import mongoose from 'mongoose'

const propertyPointOfContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    postCode: {
      type: String,
    },
    contact: {
      type: String,
    },
    email: {
      type: String,
    },
    city: {
      type: String,
    },
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdByUserName: {
      type: String,
      required: true,
    },
    createdAgainstCustomerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    createdAgainstCustomerName: {
      type: String,
      required: true,
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

export default mongoose.model(
  'PropertyPointOfContact',
  propertyPointOfContactSchema
)
