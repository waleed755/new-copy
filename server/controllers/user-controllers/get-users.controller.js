import userModel from '../../models/user.model.js'

export const getAllUsers = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const user = await userModel.findById(req.userId)

    // Extract the companyId from the user document
    const companyId = user.companyId

    const users = await userModel.find({ companyId })
    res.json({ success: true, users: users })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAllUsers
