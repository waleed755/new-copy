import userModel from '../../models/user.model.js'
import jwt from 'jsonwebtoken'

export const otpVerify = async (req, res) => {
  const { email, otp } = req.body

  try {
    const findEmail = email.trim().toLowerCase()

    const user = await userModel.findOne({ email: findEmail, otp })
    if (user) {
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
        expiresIn: '1h',
      })

      res.json({
        success: true,
        message: 'Login Successfully!!!',
        token: token,
        role: user.role,
        user: user,
      })
    } else {
      return res.json({
        success: false,
        message: 'Opt is Incorrect!',
      })
    }
  } catch (error) {
    console.error(error)
  }
}

export default otpVerify
