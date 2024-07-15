import typeModel from '../../../models/property-select-models/type.model.js'
import userModel from '../../../models/user.model.js'

export const getAllTypes = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const user = await userModel.findById(req.userId)

    // Extract the companyId from the user document
    const companyId = user.companyId

    const types = await typeModel.find({ companyId })
    res.json({ success: true, types: types })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAllTypes
