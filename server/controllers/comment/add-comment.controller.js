import activityModel from '../../models/activity.model.js'
import commentModel from '../../models/comment.model.js'
import userModel from '../../models/user.model.js'

export const addComment = async (req, res) => {
  const { activityId } = req.params // Extract activityId from URL parameter
  const { commentData } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // finding the login user
    const user = await userModel.findById(req.userId)
    commentData.userId = user._id
    commentData.userName = user.fullName

    // Check if the activity exists
    const activity = await activityModel.findById(activityId)
    commentData.activityId = activity._id

    const comment = await commentModel.create(commentData)

    if (!comment) {
      return res
        .status(404)
        .json({ error: true, message: 'Comment is not Added!!' })
    }

    res.json({
      success: true,
      message: 'Comment has been Added!',
      comment: comment,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
}

export default addComment
