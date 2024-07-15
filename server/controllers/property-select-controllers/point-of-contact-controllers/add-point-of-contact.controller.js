import customerModel from '../../../models/customer.model.js'
import pointOfContactModel from '../../../models/property-select-models/point-of-contact.model.js'
import userModel from '../../../models/user.model.js'

export const addPointOfContact = async (req, res) => {
  const { data } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // finding the user
    const user = await userModel.findById(req.userId)

    const customer = await customerModel.findById(data.customerId)

    data.createdByUserId = user._id
    data.createdByUserName = user.fullName
    data.companyId = user.companyId
    data.companyName = user.companyName
    data.createdAgainstCustomerId = customer._id
    data.createdAgainstCustomerName = customer.accountName

    // Creating a new Point of Contact Data
    await pointOfContactModel.create(data)

    res.json({ success: true, message: 'Point of Contact Added!!' })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default addPointOfContact
