import mongoose from 'mongoose'

const activitySchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
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
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    propertyName: {
      type: String,
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    companyName: {
      type: String,
    },
    //  Assigned to User
    assignedToUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedToUserName: {
      type: String,
    },
    //  Performed By
    performedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    performedByUserName: {
      type: String,
    },
    activityIsArchived: {
      type: Boolean,
      default: false,
    },
    //
    activityType: {
      type: String,
      required: true,
    },

    activityStartDate: {
      type: Date,
      required: true,
    },
    activityFinishDate: {
      type: Date,
      required: true,
    },
    activityStartTime: {
      type: String,
      required: true,
    },
    activityFinishTime: {
      type: String,
      required: true,
    },
    activityReferenceNumber: {
      type: String,
    },
    activityAdditionalInstructions: {
      type: String,
    },
    activityInternalNotes: {
      type: String,
    },
    // Vacant Property Check
    activityVpis: {
      type: Number,
    },
    // Patrol
    patrolRequired: {
      type: Number,
    },
    // Alarm Clock
    alarmActivationType: {
      type: String,
    },
    activityCreatedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    activityCreatedByUserName: {
      type: String,
      required: true,
    },
    activityStatus: {
      type: String,
      enum: [
        'Pending',
        'Over Due',
        'Due',
        'Enroute',
        'On Site',
        'Off Site',
        'Submitted',
        'submitted',
        'Completed',
      ],
      required: true,
      default: 'Pending',
    },
    // For Report
    activityTotalFee: {
      type: Number,
    },
    activityTotalTime: {
      type: String,
    },
    // Activity Locations
    onSitelong: {
      type: String,
    },
    onSitelat: {
      type: String,
    },

    onTheWaylat: {
      type: String,
    },
    onTheWayLong: {
      type: String,
    },
    onAcceptedlat: {
      type: String,
    },
    onAcceptedLong: {
      type: String,
    },
    offSitelat: {
      type: String,
    },
    offSiteLong: {
      type: String,
    },
    // Activity Dates & Times
    activityAcceptedDate: {
      type: Date,
    },
    activityAcceptedTime: {
      type: String,
    },
    activityOnTheWayDate: {
      type: Date,
    },
    activityOnTheWayTime: {
      type: String,
    },
    activityOnSiteDate: {
      type: Date,
    },
    activityOnSiteTime: {
      type: String,
    },
    activityOffSiteDate: {
      type: Date,
    },
    activityOffSiteTime: {
      type: String,
    },
    // to handle if the activity is already filled
    activityAlreadyFilled: {
      type: String,
    },
    // Officer Response Updated At
    officerResponseUpdatedAtDate: {
      type: Date,
    },
    isCancelled: {
      type: Boolean,
    },
    cancellationReason: {
      type: String,
    },
    officerResponseModifiedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    officerResponseModifiedByUserName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Activity', activitySchema)
