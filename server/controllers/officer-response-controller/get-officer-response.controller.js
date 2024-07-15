import activityModel from '../../models/activity.model.js'
import branchModel from '../../models/branch.model.js'
import officerResponseModel from '../../models/officer-response.model.js'
import propertyModel from '../../models/property.model.js'

export const getSingleOfficerResponse = async (req, res) => {
  const { activityData } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const officerResponse = await officerResponseModel.findOne({
      activityId: activityData.activityId,
    })

    if (!officerResponse) {
      return res
        .status(404)
        .json({ error: true, message: 'Officer Response is not found!' })
    }

    //  finding activity
    const activity = await activityModel.findById(activityData.activityId)

    //  finding branch
    const branch = await branchModel.findById(activity.branchId)
    const branchEmail = branch.branchEmail ? branch.branchEmail : null

    res.json({
      success: true,
      officerResponse: officerResponse,
      activity: activity,
      branchEmail: branchEmail,
    })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getSingleOfficerResponse
