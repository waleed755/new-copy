import mongoose from 'mongoose'

const officerResponseSchema = new mongoose.Schema(
  {
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: true,
    },
    activityType: {
      type: String,
      required: true,
    },
    officerResponseAlreadyFilled: {
      type: String,
    },

    // Vacant Property Check
    officerGainEntry: {
      type: String,
    },
    officerAlarmPanelDisplay: {
      type: String,
    },
    officerAllAreasClear: {
      type: String,
    },
    officerExternalLighting: {
      type: String,
    },
    officerBrickwork: {
      type: String,
    },
    officerDoorsWindowsSecure: {
      type: String,
    },
    officerSecurityAlarm: {
      type: String,
    },
    officerEvidenceVandalism: {
      type: String,
    },
    officerFireAlarm: {
      type: String,
    },
    officerLighting: {
      type: String,
    },
    officerHeating: {
      type: String,
    },
    officerInternalAreasClear: {
      type: String,
    },
    officerEvidenceActivityVermin: {
      type: String,
    },
    officerWaterTanks: {
      type: String,
    },
    officerEvidenceWaterIngress: {
      type: String,
    },
    officerEvidenceDamp: {
      type: String,
    },
    officerIncreasedRisksLocation: {
      type: String,
    },
    officerIncreasedRisksSlipTrip: {
      type: String,
    },
    officerIssuesMainElectricitySupply: {
      type: String,
    },
    officerLooseDangerousBuildingFabric: {
      type: String,
    },
    officerIssuesBoilerRoom: {
      type: String,
    },
    officerElectricityMeter: {
      type: Boolean,
    },
    officerGasMeter: {
      type: Boolean,
    },
    officerWaterMeter: {
      type: Boolean,
    },
    officerElectricityMeterReading: {
      type: String,
    },
    officerGasMeterReading: {
      type: String,
    },
    officerWaterMeterReading: {
      type: String,
    },
    officerGeneralComments: {
      type: String,
    },
    officerFollowUpInstructions: {
      type: String,
    },

    // Patrol
    patrolRequired: {
      type: String,
    },
    patrolSchedule: {
      type: String,
    },
    officerReferenceNumber: {
      type: String,
    },
    officerAdditionalInstructions: {
      type: String,
    },
    officerInternalNotes: {
      type: String,
    },
    officerCkhRef: {
      type: String,
    },
    patrolType: {
      type: String,
    },
    callReceivedDateTime: {
      type: Date,
    },
    dateTimeOnSite: {
      type: Date,
    },
    dateTimeOffSite: {
      type: Date,
    },
    responseOfficerName: {
      type: String,
    },
    responseOfficerReport: {
      type: String,
    },
    intruderAlarmDisplay: {
      type: String,
    },
    officerExternalPatrol: {
      type: String,
    },
    officerInternalPatrol: {
      type: String,
    },
    exitsChecked: {
      type: Boolean,
    },
    windowsChecked: {
      type: Boolean,
    },
    toiletsKitchenChecked: {
      type: Boolean,
    },
    peopleOnSite: {
      type: Boolean,
    },
    patrolReport: {
      type: String,
    },
    intruderAlarmReset: {
      type: Boolean,
    },
    intruderAlarmRearmed: {
      type: Boolean,
    },
    arcContacted: {
      type: Boolean,
    },
    arcOperatorName: {
      type: String,
    },
    followUpActions: {
      type: String,
    },

    officerCauseOfActivation: {
      type: String,
    },
    officerComments: {
      type: String,
    },
    officerPhotos: [
      {
        type: String,
      },
    ],
    officerVideos: [
      {
        type: String,
      },
    ],
    // to handle if the Officer Response already filled
    officerResponseAlreadyFilled: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('OfficerResponse', officerResponseSchema)
