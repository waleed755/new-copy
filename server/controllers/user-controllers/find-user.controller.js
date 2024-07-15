import userModel from '../../models/user.model.js'

export const findUser = async (req, res) => {
  const { email } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  const findEmail = userData.email.trim().toLowerCase()

  try {
    const user = await userModel.findOne({ email: findEmail })

    res.json({ success: true, user: user })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default findUser
