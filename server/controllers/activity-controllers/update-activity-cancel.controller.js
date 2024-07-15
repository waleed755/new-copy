import activityModel from '../../models/activity.model.js'

export const cancelActivity = async (req, res) => {
  const { activityData } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const activity = await activityModel.findByIdAndUpdate(
      activityData.activityId,
      activityData,
      { new: true }
    )

    res.json({
      success: true,
      message: 'Activity Cancelled!',
      activity: activity,
    })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default cancelActivity
