import branchModel from '../../models/branch.model.js'
import customerModel from '../../models/customer.model.js'
import statusModel from '../../models/property-select-models/status.model.js'
import propertyModel from '../../models/property.model.js'
import userModel from '../../models/user.model.js'
import auditReport from '../../services/audit-report.service.js'

export const customerStatusToggler = async (req, res) => {
  const { customerData } = req.body
  const ipAddress = req.ipAddress
  let myBranches = []
  let myProperties = []

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  //! finding the login user
  const user = await userModel.findById(req.userId)

  // ! Customer
  const updateCustomerStatus = async (customerId, accountStatusId) => {
    const status = await statusModel.findById(accountStatusId)
    const accountStatus = { id: status._id, value: status.value }
    return await customerModel.findByIdAndUpdate(customerId, {
      accountStatus: accountStatus,
    })
  }

  // ! Branch
  const fetchBranchesByCustomer = async customerId => {
    const branches = await branchModel.find({ customerId })
    if (!branches) {
      return res
        .status(404)
        .json({ error: true, message: 'No Branches Found!' })
    } else {
      return branches
    }
  }

  const updateBranchStatus = async (branchId, branchStatusId) => {
    const status = await statusModel.findById(branchStatusId)
    const branchStatus = { id: status._id, value: status.value }
    return await branchModel.findByIdAndUpdate(branchId, {
      branchStatus: branchStatus,
    })
  }

  // ! Property
  const fetchPropertiesByBranch = async branchId => {
    const properties = await propertyModel.find({ branchId })
    if (!properties) {
      return res
        .status(404)
        .json({ error: true, message: 'No Properties Found!' })
    } else {
      return properties
    }
  }

  const updatePropertyStatus = async (propertyId, propertyStatusId) => {
    const status = await statusModel.findById(propertyStatusId)
    const propertyStatus = { id: status._id, value: status.value }
    return await propertyModel.findByIdAndUpdate(propertyId, {
      propertyStatus: propertyStatus,
    })
  }

  try {
    if (customerData.accountStatusId === '6633921057185ddd40693b4f') {
      //! Handling Customer Case
      const updatedCustomer = await updateCustomerStatus(
        customerData.customerId,
        customerData.accountStatusId
      )

      //! Updating update-customer-status in the audit record
      const customerObjectId = updatedCustomer._id
      const customerStringId = customerObjectId.toString()
      const customerStatusCurrentDate = new Date()
      const addCustomerStatusAuditReport = await auditReport(
        user._id,
        customerStatusCurrentDate,
        'Customer Status Updated to Active',
        `${user.fullName} has updated the customer-(${updatedCustomer.accountName}) status to Active`,
        ipAddress,
        'Customer',
        customerStringId
      )
      console.log(
        'addCustomerStatusAuditReport = ',
        addCustomerStatusAuditReport
      )

      res.json({
        success: true,
        message: 'Status has been Updated!',
        customer: updatedCustomer,
      })
    } else {
      //! Handling Customer Case
      const updatedCustomer = await updateCustomerStatus(
        customerData.customerId,
        customerData.accountStatusId
      )

      //! Handling Branch Case
      const branches = await fetchBranchesByCustomer(customerData.customerId)

      for (const branch of branches) {
        // Update branch status
        let newBranch = await updateBranchStatus(
          branch._id,
          customerData.accountStatusId
        )
        myBranches.push(newBranch)

        //! Handling properties Case
        const properties = await fetchPropertiesByBranch(branch._id)

        for (const property of properties) {
          // Update property status
          let newProperty = await updatePropertyStatus(
            property._id,
            customerData.accountStatusId
          )
          myProperties.push(newProperty)
        }
      }

      //! Updating update-customer-status in the audit record
      const customerObjectId = updatedCustomer._id
      const customerStringId = customerObjectId.toString()
      const customerStatusCurrentDate = new Date()
      const addCustomerStatusAuditReport = await auditReport(
        user._id,
        customerStatusCurrentDate,
        `Customer status & it's relevant branches statuses & properties statuses Updated to Inactive`,
        `${user.fullName} has updated the customer-(${updatedCustomer.accountName}) status & it's relevant branches statuses & properties statuses to Inactive`,
        ipAddress,
        'Customer',
        customerStringId
      )
      console.log(
        'addCustomerStatusAuditReport = ',
        addCustomerStatusAuditReport
      )

      res.json({
        success: true,
        message: 'Status has been Updated!',
        customer: updatedCustomer,
        branches: myBranches,
        properties: myProperties,
      })
    }
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default customerStatusToggler
