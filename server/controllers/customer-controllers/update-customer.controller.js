import branchModel from '../../models/branch.model.js'
import customerModel from '../../models/customer.model.js'
import statusModel from '../../models/property-select-models/status.model.js'

export const updateCustomer = async (req, res) => {
  const { customerId } = req.params // Extract customerId from URL parameter
  const { customerData } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // Check if the customer exists
    const customer = await customerModel.findById(customerId)

    if (!customer) {
      return res
        .status(404)
        .json({ error: true, message: 'Customer not found' })
    }

    const status = customerData.accountStatusId
      ? await statusModel.findById(customerData.accountStatusId)
      : null

    const accountStatus = status
      ? { id: status._id, value: status.value }
      : null

    customerData.accountStatus = accountStatus

    const customerUpdatedData = {
      accountAddress: customerData.accountAddress
        ? customerData.accountAddress
        : null,
      accountBranch: customerData.accountBranch,
      accountContact: customerData.accountContact
        ? customerData.accountContact
        : null,
      accountEmail: customerData.accountEmail
        ? customerData.accountEmail
        : null,
      accountId: customerData.accountId ? customerData.accountId : null,
      accountName: customerData.accountName,
      accountNotes: customerData.accountNotes
        ? customerData.accountNotes
        : null,
      accountStatus: customerData.accountStatus
        ? customerData.accountStatus
        : null,
    }

    //  updating the customer
    const updatedCustomer = await customerModel.findByIdAndUpdate(
      customerId,
      customerUpdatedData,
      { new: true }
    )

    if (!updatedCustomer) {
      return res
        .status(404)
        .json({ error: true, message: 'Customer not Updated!' })
    }

    // updating the branch name in the branch Table
    const branch = await branchModel.findOne({
      customerId: customer._id,
      customerName: customer.accountName,
      branchName: customer.accountBranch,
      branchRandomId: customer.branchRandomId,
    })

    branch.branchName = updatedCustomer.accountBranch
    branch.customerId = updatedCustomer._id
    branch.customerName = updatedCustomer.accountName

    await branch.save()

    res.json({ success: true, message: 'Customer updated successfully' })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
}

export default updateCustomer
