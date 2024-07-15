import statusModel from '../../models/property-select-models/status.model.js'
import propertyModel from '../../models/property.model.js'
import userModel from '../../models/user.model.js'
import auditReport from '../../services/audit-report.service.js'

export const propertyStatusToggler = async (req, res) => {
  const { propertyData } = req.body
  const ipAddress = req.ipAddress

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  // ! finding the user
  const user = await userModel.findById(req.userId)

  const updatePropertyStatus = async (propertyId, propertyStatusId) => {
    const status = await statusModel.findById(propertyStatusId)
    const propertyStatus = { id: status._id, value: status.value }
    return await propertyModel.findByIdAndUpdate(propertyId, {
      propertyStatus: propertyStatus,
    })
  }

  try {
    //! Handling Property Case
    const property = await updatePropertyStatus(
      propertyData.propertyId,
      propertyData.propertyStatusId
    )

    //! Updating Property Status in the audit record
    const propertyObjectId = property._id
    const propertyStringId = propertyObjectId.toString()
    const propertyStatusCurrentDate = new Date()
    const addPropertyStatusAuditReport = await auditReport(
      user._id,
      propertyStatusCurrentDate,
      'Property Status Updated!',
      `${user.fullName} has updated the status of the property-(${property.propertyName})`,
      ipAddress,
      'Property',
      propertyStringId
    )
    console.log('addPropertyStatusAuditReport = ', addPropertyStatusAuditReport)

    res.json({
      success: true,
      message: 'Status has been Updated!',
    })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default propertyStatusToggler
