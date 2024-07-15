import branchModel from '../../models/branch.model.js'
import statusModel from '../../models/property-select-models/status.model.js'
import staffModel from '../../models/staff.model.js'
import userModel from '../../models/user.model.js'
import auditReport from '../../services/audit-report.service.js'

export const addStaff = async (req, res) => {
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
    const branch = await branchModel.findById(staffData.branchId)

    // Adding Status
    const status = staffData.statusId
      ? await statusModel.findById(staffData.statusId)
      : null

    const staffStatus = status ? { id: status._id, value: status.value } : null

    // Address
    const staffAddress = staffData.address
      ? {
          address: staffData?.address,
          city: staffData?.city,
          postCode: staffData?.postCode,
        }
      : null

    // Creating a New Customer Data
    const newStaff = {
      staffCreatedByUserId: user._id,
      staffCreatedByUserName: user.fullName,
      companyId: user.companyId,
      companyName: user.companyName,
      branchId: branch._id,
      branchName: branch.branchName,
      staffName: staffData.staffName,
      staffStatus: staffStatus,
      staffAddress: staffAddress,
      staffContact: staffData.staffContact,
      staffEmail: staffData.staffEmail,
    }

    const staff = await staffModel.create(newStaff)

    //! adding staff/partner in the audit record
    const staffObjectId = staff._id
    const staffStringId = staffObjectId.toString()
    const staffCurrentDate = new Date()
    const addStaffAuditReport = await auditReport(
      user._id,
      staffCurrentDate,
      'Partner is Added',
      `${user.fullName} has added a new Partner name ${staff.staffName}`,
      ipAddress,
      'Partner',
      staffStringId
    )
    console.log('addStaffAuditReport = ', addStaffAuditReport)

    res.json({
      success: true,
      message: 'New Staff has been Added!',
      staff: staff,
    })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default addStaff
