import aiModel from '../../../models/property-select-models/ai.model.js'

export const addAI = async (req, res) => {
  const { data } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // Creating a new AI Data
    const ai = await aiModel.create(data)

    res.json({ success: true, ai: ai })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default addAI
