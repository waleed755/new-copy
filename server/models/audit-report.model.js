import mongoose from 'mongoose'
import { dateTransform } from '../services/date-formate.service.js'

const auditReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdDate: {
      type: String,
    },
    action: {
      type: String,
    },
    description: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    actionType: {
      type: String,
    },
    value:{
      type: String,
    },
    oldValue: {
      type: String,
    },
    newValue: {
      type: String,
    },
  }
  //   { timestamps: true }
)

// auditReportSchema.set('toJSON', {
//   transform: dateTransform,
// })

export default mongoose.model('AuditReport', auditReportSchema)
