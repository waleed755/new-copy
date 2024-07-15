import activityModel from '../../models/activity.model.js'
import officerResponseModel from '../../models/officer-response.model.js'

export const getSingleOfficerResponsePublic = async (req, res) => {
  const { activityData } = req.body

  try {
    const officerResponse = await officerResponseModel.findOne({
      activityId: activityData.activityId,
    })

    if (!officerResponse) {
      return res
        .status(404)
        .json({ error: true, message: 'Officer Response is not found!' })
    }

    const activity = await activityModel.findById(activityData.activityId)

    res.json({
      success: true,
      officerResponse: officerResponse,
      activity: activity,
    })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getSingleOfficerResponsePublic
