import aiModel from '../../../models/property-select-models/ai.model.js'

export const getAllAI = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const ais = await aiModel.find({})
    res.json({ success: true, ais: ais })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAllAI
