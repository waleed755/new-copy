import customerModel from '../../models/customer.model.js'
import userModel from '../../models/user.model.js'

export const getAllCustomers = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const user = await userModel.findById(req.userId)

    // Extract the companyId from the user document
    const companyId = user.companyId

    const customers = await customerModel.find({ companyId })
    res.json({ success: true, customers: customers })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAllCustomers
