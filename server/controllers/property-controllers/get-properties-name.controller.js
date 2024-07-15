import propertyModel from '../../models/property.model.js'
import userModel from '../../models/user.model.js'

export const getAllPropertiesNames = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const user = await userModel.findById(req.userId)

    // Extract the companyId from the user document
    const companyId = user.companyId

    const properties = await propertyModel.find({ companyId }, 'propertyName')

    res.json({ success: true, properties: properties })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAllPropertiesNames
