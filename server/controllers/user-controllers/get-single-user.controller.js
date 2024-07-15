import userModel from '../../models/user.model.js'

export const getSingleUser = async (req, res) => {
  const { userId } = req.params // Extract userId from URL parameter

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // Check if the user exists
    const user = await userModel.findById(userId)

    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' })
    }

    res.json({ success: true, user: user })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
}

export default getSingleUser
