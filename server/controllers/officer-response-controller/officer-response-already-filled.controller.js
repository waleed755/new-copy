import activityModel from '../../models/activity.model.js'
import officerResponseModel from '../../models/officer-response.model.js'
import userModel from '../../models/user.model.js'
import auditReport from '../../services/audit-report.service.js'

export const officerResponseAlreadyFilled = async (req, res) => {
  const { activityId } = req.params // Extract activityId from URL parameter
  const ipAddress = req.ipAddress
  console.log('activityId', req.params)
  const { officerResponseData } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    console.log('activityId', req.params)

    // ! finding the login user
    const loginUser = await userModel.findById(req.userId)

    // Check if the activity exists
    const activity = await activityModel.findById(activityId)

    officerResponseData.activityId = activity._id
    officerResponseData.activityType = activity.activityType

    if (!activity) {
      return res
        .status(404)
        .json({ error: true, message: 'Activity not found' })
    }

    const officerResponse = await officerResponseModel.create(
      officerResponseData
    )

    if (!officerResponse) {
      return res
        .status(404)
        .json({ error: true, message: 'Officer Response is Not Added!!' })
    }

    //! adding create-officerResponse-already-filled in the audit record
    const officerResponseObjectId = officerResponse._id
    const officerResponseStringId = officerResponseObjectId.toString()
    const officerResponseAlreadyFilledCurrentDate = new Date()
    const addOfficerResponseAlreadyFilledAuditReport = await auditReport(
      loginUser._id,
      officerResponseAlreadyFilledCurrentDate,
      'Officer Response is Added',
      `${loginUser.fullName} has added a new Officer Response`,
      ipAddress,
      'Officer Response',
      officerResponseStringId
    )
    console.log(
      'addOfficerResponseAlreadyFilledAuditReport = ',
      addOfficerResponseAlreadyFilledAuditReport
    )

    res.json({
      success: true,
      message: 'Officer Response has been Added!',
      officerResponse: officerResponse,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
}

export default officerResponseAlreadyFilled
