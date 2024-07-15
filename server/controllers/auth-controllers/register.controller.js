import userModel from '../../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendEmail from '../../services/send-email.service.js'

export const register = async (req, res) => {
  try {
    const { userData } = req.body

    if (!userData) {
      return res
        .status(400)
        .json({ error: true, message: 'User data is required' })
    }

    const existingUser = await userModel.findOne({
      email: userData.email.trim().toLowerCase(),
    })

    if (existingUser) {
      return res
        .status(400)
        .json({ error: true, message: 'User with this email already exists' })
    }

    // if (!req.files || !req.files['userPhoto']) {
    //   return res
    //     .status(400)
    //     .json({ error: true, message: 'User photo is required' })
    // }

    // const userFile = req.files['userPhoto'][0] // Assuming multer array is used

    // const userParams = {
    //   Bucket: 'keyholding',
    //   Key: `${Date.now()}_${userFile.originalname}`,
    //   Body: userFile.buffer,
    //   ACL: 'public-read',
    // }

    // const userUploadResponse = await s3.upload(userParams).promise()
    // userData.userPhoto = userUploadResponse.Location

    const hashedPassword = await bcrypt.hash(userData.password, 10)
    userData.password = hashedPassword
    userData.userMfa = 1

    // const company = await companyModel.create({})

    // userData.companyId = company._id

    const newUser = await userModel.create(userData)

    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    })

    if (newUser) {
      await sendEmail(
        newUser.email,
        'Welcome to Rapto!',
        `<p>Dear ${newUser.fullName}</p>
        <p>Thank you for signing up with Rapto! We are excited to have you on board and are looking forward to helping you simplify and secure your experience.</p>
        <p>To get started, please click on the link below to verify your email address and activate your account: [Verification Link] </p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team at support@rapto.co.uk. </p>
        <p>Welcome aboard!</p>
        <p>The Rapto Team</p>
        `,
        'Verification Email Sent Successfully!!!'
      )
    }

    res.json({ success: true, user: newUser, token: token })
  } catch (error) {
    console.error('Error during registration:', error)
    res.status(500).json({ error: true, message: error.message })
  }
}

export default register
