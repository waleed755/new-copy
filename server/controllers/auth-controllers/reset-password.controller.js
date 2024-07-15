import userModel from '../../models/user.model.js'
import bcrypt from 'bcrypt'

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body

    const findEmail = email.trim().toLowerCase()

    // Check if the email exists in the database
    const user = await userModel.findOne({ email: findEmail })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Generate a hash of the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update the user's password in the database
    user.password = hashedPassword
    await user.save()

    res.json({
      success: true,
      message: 'Password updated successfully',
    })
  } catch (error) {
    res.status(500).json({ error: 'true', message: error.message })
  }
}

export default resetPassword
