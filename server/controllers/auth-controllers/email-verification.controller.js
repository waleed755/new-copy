import userModel from '../../models/user.model.js'
import generateOTP from '../../services/generate-opt.service.js'
import sendEmail from '../../services/send-email.service.js'

export const verifyEmail = async (req, res) => {
  const { email } = req.body

  try {
    const findEmail = email.trim().toLowerCase()
    // Find the user by email
    const user = await userModel.findOne({ email: findEmail })
    if (!user) {
      return res.status(401).json({ error: true, message: 'Invalid email' })
    }

    //  Sending OPT on the Email
    const OTP = generateOTP()

    await sendEmail(
      findEmail,
      `Reset Your Rapto Password`,
      `
      <p>Hi ${user.fullName},</p>
      <p>You recently requested to reset your password for your Rapto account. No worries, we can help you get back into your account safely! </p>
      <p>Here is your One-Time Password (OTP) to proceed with a secure password: </p>
      <p>${OTP}</p>
      <p>This OTP is valid for the next 10 minutes and should not be shared with anyone. If you did not request this code, please contact our support team immediately at support@rapto.co.uk.</p>
      <p>Securely,</p>
      <p>The Rapto Team</p>`,
      'OPT for change password is successfully sent on the Email!!'
    )

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
    res.status(500).json({ error: true, message: 'Failed to login' })
  }
}

export default verifyEmail
