import statusModel from '../../../models/property-select-models/status.model.js'

export const getAllStatuses = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const statuses = await statusModel.find({})
    res.json({ success: true, statuses: statuses })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAllStatuses
