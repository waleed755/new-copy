import userModel from '../../models/user.model.js'
import bcrypt from 'bcrypt'

export const fillUserPassword = async (req, res) => {
  const { userId } = req.params // Extract userId from URL parameter
  let { password } = req.body

  try {
    if (!password) {
      return res
        .status(404)
        .json({ error: true, message: 'Password is Compulsory!' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    password = hashedPassword

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { password: password },
      {
        new: true,
      }
    )

    if (!updatedUser) {
      return res
        .status(404)
        .json({ error: true, message: 'Password set failed!' })
    }

    res.json({
      success: true,
      message: 'Password set successfully!',
      user: updatedUser,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
}

export default fillUserPassword
