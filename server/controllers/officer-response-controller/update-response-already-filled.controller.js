import officerResponseModel from '../../models/officer-response.model.js'

export const updateOfficerResponseAlreadyFilled = async (req, res) => {
  const { officerResponseId } = req.params // Extract officerResponseId from URL parameter
  const { officerResponseData } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    console.log('officerResponseId', req.params)

    // Check if an officer response already exists
    const existingOfficerResponse = await officerResponseModel.findById(
      officerResponseId
    )

    if (existingOfficerResponse) {
      // Update the existing officer response
      const updatedOfficerResponse =
        await officerResponseModel.findByIdAndUpdate(
          existingOfficerResponse._id,
          officerResponseData,
          { new: true }
        )

      if (!updatedOfficerResponse) {
        return res
          .status(500)
          .json({ error: true, message: 'Officer Response update failed' })
      }

      return res.json({
        success: true,
        message: 'Officer Response has been updated!',
        officerResponse: updatedOfficerResponse,
      })
    } else {
      return res
        .status(404)
        .json({ error: true, message: 'Officer Response not found' })
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
}

export default updateOfficerResponseAlreadyFilled
