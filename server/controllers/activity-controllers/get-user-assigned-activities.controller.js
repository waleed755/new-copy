import activityModel from '../../models/activity.model.js'
import userModel from '../../models/user.model.js'

export const getUserAssignedActivities = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const user = await userModel.findById(req.userId)

    // Extract the companyId from the user document
    const companyId = user.companyId

    const allActivities = await activityModel.find({
      companyId,
      assignedToUserId: user._id,
    })

    res.json({ success: true, allActivities: allActivities })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getUserAssignedActivities
