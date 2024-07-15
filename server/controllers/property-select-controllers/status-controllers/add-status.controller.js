import statusModel from '../../../models/property-select-models/status.model.js'

export const addStatus = async (req, res) => {
  const { data } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // Creating a new Status Data
    await statusModel.create(data)

    res.json({ success: true, message: 'Status Added!!' })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default addStatus
