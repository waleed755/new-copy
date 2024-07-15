import activityModel from '../../models/activity.model.js'
import propertyModel from '../../models/property.model.js'

export const getSingleActivity = async (req, res) => {
  const { activityId } = req.params // Extract activityId from URL parameter

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // Check if the Activity exists
    const activity = await activityModel.findById(activityId)

    //  finding property
    const property = await propertyModel.findById(activity.propertyId)

    const propertyAI = property.propertyAI
    const aiImages = property.aiFiles

    if (!activity) {
      return res
        .status(404)
        .json({ error: true, message: 'Activity not found' })
    }

    res.json({
      success: true,
      activity: activity,
      propertyAI: propertyAI,
      aiImages: aiImages,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
}

export default getSingleActivity
