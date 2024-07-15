import keysModel from '../../../models/property-select-models/keys.model.js'
import userModel from '../../../models/user.model.js'

export const getAllKeys = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const user = await userModel.findById(req.userId)

    // Extract the companyId from the user document
    const companyId = user.companyId

    const keys = await keysModel.find({ companyId })
    res.json({ success: true, keys: keys })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAllKeys
