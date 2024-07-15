import branchModel from '../../models/branch.model.js'
import statusModel from '../../models/property-select-models/status.model.js'
import staffModel from '../../models/staff.model.js'

export const updateStaff = async (req, res) => {
  const { staffId } = req.params // Extract staffId from URL parameter
  const { staffData } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // Check if the staff exists
    const staff = await staffModel.findById(staffId)
    const branch = await branchModel.findById(staffData.branchId)

    if (!staff) {
      return res.status(404).json({ error: true, message: 'Staff not found' })
    }

    // Update Status
    if (staffData.statusId) {
      const status =
        staffData.statusId && (await statusModel.findById(staffData.statusId))

      const staffStatus = status && { id: status._id, value: status.value }

      staffData.staffStatus = staffStatus
    }

    // update Address
    const staffAddress = staffData.address && {
      address: staffData?.address,
      city: staffData?.city,
      postCode: staffData?.postCode,
    }

    const staffToUpdate = {
      branchId: branch._id,
      branchName: branch.branchName,
      staffName: staffData.staffName,
      staffStatus:  staffData.staffStatus ,
      staffAddress: staffAddress,
      staffContact: staffData.staffContact,
      staffEmail: staffData.staffEmail,
    }

    const updatedStaff = await staffModel.findByIdAndUpdate(
      staffId,
      staffToUpdate,
      { new: true }
    )

    if (!updatedStaff) {
      return res
        .status(404)
        .json({ error: true, message: 'Staff not Updated!' })
    }

    res.json({ success: true, message: 'Staff updated successfully' })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
}

export default updateStaff
