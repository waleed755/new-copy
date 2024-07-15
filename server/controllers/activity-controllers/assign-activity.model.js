import activityModel from '../../models/activity.model.js'
import userModel from '../../models/user.model.js'
import auditReport from '../../services/audit-report.service.js'

export const assignActivityToUser = async (req, res) => {
  const { activityData } = req.body
  const ipAddress = req.ipAddress

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // ! finding the login user
    const loginUser = await userModel.findById(req.userId)

    const user = await userModel.findById(activityData.userId)

    const activity = await activityModel.findByIdAndUpdate(
      activityData.activityId,
      {
        assignedToUserId: user._id,
        assignedToUserName: user?.fullName,
      },
      { new: true }
    )

    //! adding user-assign in the audit record
    const activityObjectId = activity._id
    const activityStringId = activityObjectId.toString()
    const userAssignCurrentDate = new Date()
    const userAssignAuditReport = await auditReport(
      loginUser._id,
      userAssignCurrentDate,
      `Activity Assigned the User Created`,
      `${loginUser.fullName} assigned an activity-(${activity.activityType}) to user-(${user.fullName})`,
      ipAddress,
      'Activity',
      activityStringId
    )
    console.log('userAssignAuditReport = ', userAssignAuditReport)

    res.json({
      success: true,
      message: 'Status has been Updated!',
      activity: activity,
    })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default assignActivityToUser
