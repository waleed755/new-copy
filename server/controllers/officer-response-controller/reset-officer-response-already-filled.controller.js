import activityModel from '../../models/activity.model.js'
import officerResponseModel from '../../models/officer-response.model.js'

export const resetOfficerResponseAlreadyFilled = async (req, res) => {
  const { officerResponseId } = req.params // Extract officerResponseId from URL parameter

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const officerResponse = await officerResponseModel.findByIdAndUpdate(
      officerResponseId,
      { officerResponseAlreadyFilled: '' },
      { new: true }
    )

    const activity = await activityModel.findByIdAndUpdate(
      officerResponse.activityId,
      { activityStatus: 'On Site' },
      { new: true }
    )

    res.json({
      success: true,
      message: 'Status has been Updated!',
      activity: activity,
      officerResponse: officerResponse,
    })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default resetOfficerResponseAlreadyFilled
