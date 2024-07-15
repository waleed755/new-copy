import pointOfContactModel from '../../../models/property-select-models/point-of-contact.model.js'
import userModel from '../../../models/user.model.js'

export const getAllPointOfContacts = async (req, res) => {
  const { data } = req.body
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const user = await userModel.findById(req.userId)

    const pointOfContacts = await pointOfContactModel.find({
      createdAgainstCustomerId: data.customerId,
      companyId: user.companyId,
    })

    if (pointOfContacts.length === 0) {
      return res.json({ success: true, pointOfContacts: pointOfContacts })
    }

    res.json({ success: true, pointOfContacts: pointOfContacts })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAllPointOfContacts
