import activityModel from '../../models/activity.model.js'
import userModel from '../../models/user.model.js'

export const getActivitiesByType = async (req, res) => {
  const { activityData } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const user = await userModel.findById(req.userId)

    // Extract the companyId from the user document
    const companyId = user.companyId
    const activityType = activityData.activityType

    const allActivities = await activityModel.find({ companyId, activityType })
    res.json({ success: true, allActivities: allActivities })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getActivitiesByType
