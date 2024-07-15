import activityModel from '../../models/activity.model.js'
import userModel from '../../models/user.model.js'
import auditReport from '../../services/audit-report.service.js'

export const updateActivityStatus = async (req, res) => {
  const { activityData } = req.body
  const ipAddress = req.ipAddress
  console.log('activityData = ', activityData)

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  function parseDateToISOString(dateString) {
    // Expecting dateString in "dd-mm-yyyy" format
    const [day, month, year] = dateString.split('-')
    // Construct a Date object (month is 0-based in Date constructor)
    const date = new Date(Date.UTC(year, month - 1, day))
    // Convert to ISO 8601 string
    return date.toISOString()
  }

  try {
    // ! finding the login user
    const loginUser = await userModel.findById(req.userId)

    const user = await userModel.findById(activityData.performedByUserId)

    activityData.performedByUserName = user?.fullName

    // if (activityData.activityOnSiteDate) {
    //   activityData.activityOnSiteDate = parseDateToISOString(
    //     activityData.activityOnSiteDate
    //   )
    // }

    if (activityData.activityOffSiteDate) {
      activityData.activityOffSiteDate = parseDateToISOString(
        activityData.activityOffSiteDate
      )
    }

    const activity = await activityModel.findByIdAndUpdate(
      activityData.activityId,
      activityData,
      { new: true }
    )

    //! adding update-activity-status in the audit record
    const activityObjectId = activity._id
    const activityStringId = activityObjectId.toString()
    const activityStatusCurrentDate = new Date()
    const activityStatusAuditReport = await auditReport(
      loginUser._id,
      activityStatusCurrentDate,
      `Activity Status Updated`,
      `${loginUser.fullName} updated activity-(${activity.activityType}) status to ${activity.activityStatus}`,
      ipAddress,
      'Activity',
      activityStringId
    )
    console.log('activityStatusAuditReport = ', activityStatusAuditReport)

    res.json({
      success: true,
      message: 'Status has been Updated!',
      activity: activity,
    })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default updateActivityStatus
