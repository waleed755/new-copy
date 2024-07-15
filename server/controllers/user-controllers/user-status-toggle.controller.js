import statusModel from '../../models/property-select-models/status.model.js'
import userModel from '../../models/user.model.js'
import auditReport from '../../services/audit-report.service.js'

export const userStatusToggler = async (req, res) => {
  const { userData } = req.body
  const ipAddress = req.ipAddress

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  // ! finding the user
  const user = await userModel.findById(req.userId)

  const updateUserStatus = async (userId, userStatusId) => {
    const status = await statusModel.findById(userStatusId)
    const userStatus = { id: status._id, value: status.value }
    return await userModel.findByIdAndUpdate(userId, {
      userStatus: userStatus,
    })
  }

  try {
    const updatedUser = await updateUserStatus(
      userData.userId,
      userData.userStatusId
    )

    //! Updating User Status in the audit record
    const userObjectId = updatedUser._id
    const userStringId = userObjectId.toString()
    const userStatusCurrentDate = new Date()
    const addUserStatusAuditReport = await auditReport(
      user._id,
      userStatusCurrentDate,
      'User Status Updated!',
      `${user.fullName} has updated the status of the user-(${updatedUser.fullName})`,
      ipAddress,
      'User Status',
      userStringId
    )
    console.log('addUserStatusAuditReport = ', addUserStatusAuditReport)

    res.json({
      success: true,
      message: 'Status has been Updated!',
    })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default userStatusToggler
