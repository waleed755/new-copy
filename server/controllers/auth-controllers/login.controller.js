import userModel from '../../models/user.model.js'
import generateOTP from '../../services/generate-opt.service.js'
import bcrypt from 'bcrypt'
import sendEmail from '../../services/send-email.service.js'

export const login = async (req, res) => {
  const { email, password } = req.body

  const findEmail = email.trim().toLowerCase()

  // Find the user by email
  const user = await userModel.findOne({ email: findEmail })
  if (!user) {
    return res
      .status(401)
      .json({ error: true, message: 'Invalid email or password' })
  }

  // Compare the provided password with the stored password hash
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ error: true, message: 'Invalid email or password' })
  }

  if (user.userMfa === 1) {
    //  Sending OPT on the Email
    const OTP = generateOTP()

    await sendEmail(
      findEmail,
      `Your One-Time Password (OTP) for Rapto Login`,
      `
    <p>Dear ${user.fullName}</p>
    <p>You requested to log in to your Rapto account. Here is your One-Time Password (OTP) to proceed with a secure login:</p>
    <b>${OTP}</b>
    <p>This OTP is valid for the next 1 minute and should not be shared with anyone. If you did not request this code, please contact our support team immediately at support@rapto.co.uk.</p>
    <p>Securely,</p>
    <p>The Rapto Team</p>`,
      'OPT is successfully sent on the Email!!'
    )

    try {
      if (user) {
        await userModel.findOneAndUpdate(
          {
            email: findEmail,
          },
          {
            $set: {
              otp: OTP,
            },
          },
          { new: true }
        )

        return res.json({
          success: true,
          message: 'OTP sent to your email',
          otp: OTP,
        })
      }
    } catch (error) {
      res.status(500).json({ error: true, message: error })
    }
  } else {
    return res.json({
      success: true,
      message: 'User Login Successfully!',
      user: user,
    })
  }
}

export default login
