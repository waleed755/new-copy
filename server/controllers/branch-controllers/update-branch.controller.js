import branchModel from '../../models/branch.model.js'
import customerModel from '../../models/customer.model.js'
import statusModel from '../../models/property-select-models/status.model.js'

export const updateBranch = async (req, res) => {
  const { branchId } = req.params // Extract branchId from URL parameter
  const { branchData } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // Check if the branch exists
    const branch = await branchModel.findById(branchId)

    if (!branch) {
      return res.status(404).json({ error: true, message: 'Branch not found' })
    }

    const customer = await customerModel.findById(branch.customerId)

    const status = branchData.branchStatusId
      ? await statusModel.findById(branchData.branchStatusId)
      : null
    const branchStatus = status ? { id: status._id, value: status.value } : null
    branchData.branchStatus = branchStatus

    const branchUpdatedData = {
      customerId: customer._id,
      customerName: customer.accountName,
      customerRandomId: customer.customerRandomId,
      branchStatus: branchData.branchStatus ? branchData.branchStatus : null,
      branchAddress: branchData.branchAddress ? branchData.branchAddress : null,
      branchContact: branchData.branchContact ? branchData.branchContact : null,
      branchEmail: branchData.branchEmail ? branchData.branchEmail : null,
      branchId: branchData.branchId ? branchData.branchId : null,
      branchName: branchData.branchName,
      branchNotes: branchData.branchNotes ? branchData.branchNotes : null,
    }

    //  Updating the Branch
    const updatedBranch = await branchModel.findByIdAndUpdate(
      branchId,
      branchUpdatedData,
      { new: true }
    )

    if (!updatedBranch) {
      return res
        .status(404)
        .json({ error: true, message: 'Branch not Updated!' })
    }

    // updating the branch name in the Customer Table
    const customerToUpdate = await customerModel.findOne({
      _id: updatedBranch.customerId,
      accountName: updatedBranch.customerName,
    })

    customerToUpdate.accountBranch = updatedBranch.branchName
    customerToUpdate.branchRandomId = updatedBranch.branchRandomId
    customerToUpdate.save()

    res.json({ success: true, message: 'Branch updated successfully' })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
}

export default updateBranch
