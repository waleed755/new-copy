import officerResponseModel from '../../models/officer-response.model.js'

export const getAllOfficersResponse = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const allOfficersResponses = await officerResponseModel.find({})
    res.json({ success: true, allOfficersResponses: allOfficersResponses })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAllOfficersResponse
