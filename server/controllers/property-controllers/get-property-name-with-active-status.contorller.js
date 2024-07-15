import propertyModel from '../../models/property.model.js'
import userModel from '../../models/user.model.js'

export const getAllPropertiesNamesWithActiveStatus = async (req, res) => {
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
    const propertyStatusId = '6633921057185ddd40693b4f'

    const properties = await propertyModel.find({
      companyId,
      'propertyStatus.id': propertyStatusId,
    })

    res.json({ success: true, properties: properties })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAllPropertiesNamesWithActiveStatus
