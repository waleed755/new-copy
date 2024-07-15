import branchModel from '../../models/branch.model.js'
import companyModel from '../../models/company.model.js'
import counterModel from '../../models/counter.model.js'
import customerModel from '../../models/customer.model.js'
import statusModel from '../../models/property-select-models/status.model.js'
import userModel from '../../models/user.model.js'
import auditReport from '../../services/audit-report.service.js'

export const addBranch = async (req, res) => {
  const { branchData } = req.body
  const ipAddress = req.ipAddress

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  const getNextSequenceValue = async sequenceName => {
    const counter = await counterModel.findOneAndUpdate(
      { name: sequenceName },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    )
    return counter.value
  }

  try {
    //! finding the login User
    const user = await userModel.findById(req.userId)

    const customer = await customerModel.findById(branchData.customerId)

    const company = await companyModel.findById(user.companyId)
    const status = branchData.branchStatusId
      ? await statusModel.findById(branchData.branchStatusId)
      : null

    const branchStatus = status ? { id: status._id, value: status.value } : null

    // Generate a unique branchRandomId
    const branchRandomId = await getNextSequenceValue('branchId')

    branchData.branchCreatedByUserId = user._id
    branchData.branchCreatedByUserName = user.fullName
    branchData.customerId = customer._id
    branchData.customerName = customer.accountName
    branchData.customerRandomId = customer.customerRandomId
    branchData.companyId = company._id
    branchData.companyName = company.companyName
    branchData.branchStatus = branchStatus
    branchData.branchRandomId = branchRandomId

    // Creating a new Branch Data
    const branch = await branchModel.create(branchData)

    //! adding create-branch in the audit record
    const branchObjectId = branch._id
    const branchStringId = branchObjectId.toString()
    const branchCurrentDate = new Date()
    const branchAuditReport = await auditReport(
      user._id,
      branchCurrentDate,
      'Branch Created',
      `${user.fullName} created a branch-(${branch.branchName})`,
      ipAddress,
      'Branch',
      branchStringId
    )
    console.log('branchAuditReport = ', branchAuditReport)

    res.json({ success: true, message: 'Branch Added Successfully!' })
  } catch (error) {
    res.json({ error: true, message: error?.message })
  }
}

export default addBranch
