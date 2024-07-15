import propertyModel from '../../models/property.model.js'

export const getSingleProperty = async (req, res) => {
  const { propertyId } = req.params // Extract propertyId from URL parameter

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // Check if the property exists
    const property = await propertyModel.findById(propertyId)

    if (!property) {
      return res
        .status(404)
        .json({ error: true, message: 'Property not found' })
    }

    res.json({ success: true, property: property })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
}

export default getSingleProperty
