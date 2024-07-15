import customerModel from '../../models/customer.model.js'
import userModel from '../../models/user.model.js'

export const getAllCustomerNamesWithActiveStatus = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const user = await userModel.findById(req.userId)

    // Extract the companyId from the user document
    const companyId = user.companyId

    // Define the filter for active status
    const activeStatusId = '6633921057185ddd40693b4f'

    const customers = await customerModel.find({
      companyId,
      'accountStatus.id': activeStatusId,
    })

    res.json({ success: true, customers: customers })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAllCustomerNamesWithActiveStatus

// accountStatus.id : "6633921057185ddd40693b4f"
