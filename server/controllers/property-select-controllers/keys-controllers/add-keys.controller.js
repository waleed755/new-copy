import keysModel from '../../../models/property-select-models/keys.model.js'
import userModel from '../../../models/user.model.js'

export const addKey = async (req, res) => {
  const { data } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // finding the user
    const user = await userModel.findById(req.userId)

    data.createdByUserId = user._id
    data.createdByUserName = user.fullName
    data.companyId = user.companyId
    data.companyName = user.companyName

    // Creating a new Key Data
    await keysModel.create(data)

    res.json({ success: true, message: 'Key Added!!' })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default addKey
