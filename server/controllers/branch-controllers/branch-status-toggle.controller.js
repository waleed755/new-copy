import branchModel from '../../models/branch.model.js'
import statusModel from '../../models/property-select-models/status.model.js'
import propertyModel from '../../models/property.model.js'
import auditReport from '../../services/audit-report.service.js'

export const branchStatusToggler = async (req, res) => {
  const { branchData } = req.body
  const ipAddress = req.ipAddress

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  //! Finding the Existing User
  const user = await userModel.findById(req.userId)

  const updateBranchStatus = async (branchId, branchStatusId) => {
    const status = await statusModel.findById(branchStatusId)
    const branchStatus = { id: status._id, value: status.value }
    return await branchModel.findByIdAndUpdate(branchId, {
      branchStatus: branchStatus,
    })
  }

  // ! Property
  const fetchPropertiesByBranch = async branchId => {
    return await propertyModel.find({ branchId })
  }

  const updatePropertyStatus = async (propertyId, propertyStatusId) => {
    const status = await statusModel.findById(propertyStatusId)
    const propertyStatus = { id: status._id, value: status.value }
    return await propertyModel.findByIdAndUpdate(propertyId, {
      propertyStatus: propertyStatus,
    })
  }

  try {
    if (branchData.branchStatusId === '6633921057185ddd40693b4f') {
      //! Handling Branch Case
      const branch = await updateBranchStatus(
        branchData.branchId,
        branchData.branchStatusId
      )

      //! adding update-branch-status in the audit record
      const branchObjectId = branch._id
      const branchStringId = branchObjectId.toString()
      const branchStatusCurrentDate = new Date()
      const addBranchStatusAuditReport = await auditReport(
        user._id,
        branchStatusCurrentDate,
        'Branch Status Updated to Active',
        `${user.fullName} has updated the branch-(${branch.branchName}) status to Active`,
        ipAddress,
        'Branch',
        branchStringId
      )
      console.log('addBranchStatusAuditReport = ', addBranchStatusAuditReport)

      res.json({
        success: true,
        message: 'Status has been Updated!',
      })
    } else {
      //! Handling Branch Case
      const branch = await updateBranchStatus(
        branchData.branchId,
        branchData.branchStatusId
      )

      //! Fetch related properties
      const properties = await fetchPropertiesByBranch(branchData.branchId)

      for (const property of properties) {
        //! Update property status
        await updatePropertyStatus(property._id, branchData.branchStatusId)
      }

      //! Updating Branch Status in the audit record
      const branchObjectId = branch._id
      const branchStringId = branchObjectId.toString()
      const branchStatusCurrentDate = new Date()
      const addBranchStatusAuditReport = await auditReport(
        user._id,
        branchStatusCurrentDate,
        `Branch status & it's relevant properties status Updated to Inactive`,
        `${user.fullName} has updated the Branch-(${branch.branchName}) status & it's relevant properties status to Inactive`,
        ipAddress,
        'Branch',
        branchStringId
      )
      console.log('addBranchStatusAuditReport = ', addBranchStatusAuditReport)

      res.json({
        success: true,
        message: 'Status has been Updated!',
      })
    }
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default branchStatusToggler
