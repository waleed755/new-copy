import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    companyName: {
      type: String,
    },
    companyLogo: {
      type: String,
    },
    companyAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    otp: {
      type: Number,
    },
    role: {
      type: String,
      // enum: ['Controller', 'Mobile Driver', 'Admin'],
    },
    designation: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    userMfa: {
      type: Number,
      default: 1,
    },
    job: {
      type: String,
    },
    password: {
      type: String,
    },
    token: {
      type: String,
    },
    userPhoto: {
      type: String,
    },
    userStatus: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PropertyStatus',
      },
      value: {
        type: String,
      },
    },
  },

  { timestamps: true }
)

export default mongoose.model('User', userSchema)
