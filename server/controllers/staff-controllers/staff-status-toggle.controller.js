import statusModel from '../../models/property-select-models/status.model.js'
import staffModel from '../../models/staff.model.js'
import userModel from '../../models/user.model.js'
import auditReport from '../../services/audit-report.service.js'

export const staffStatusToggler = async (req, res) => {
  const { staffData } = req.body
  const ipAddress = req.ipAddress

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    //! finding the login User
    const user = await userModel.findById(req.userId)

    const status = await statusModel.findById(staffData.statusId)
    const staffStatus = { id: status._id, value: status.value }
    const updatedStaff = await staffModel.findByIdAndUpdate(staffData.staffId, {
      staffStatus: staffStatus,
    })

    //! Updating Partner Status in the audit record
    const staffObjectId = updatedStaff._id
    const staffStringId = staffObjectId.toString()
    const partnerStatusCurrentDate = new Date()
    const addPartnerStatusAuditReport = await auditReport(
      user._id,
      partnerStatusCurrentDate,
      'Partner Status Updated!',
      `${user.fullName} has updated the partner-(${updatedStaff.staffName}) status to Active`,
      ipAddress,
      'Staff',
      staffStringId
    )
    console.log('addPartnerStatusAuditReport = ', addPartnerStatusAuditReport)

    res.json({
      success: true,
      message: 'Status has been Updated!',
      staff: updatedStaff,
    })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default staffStatusToggler
