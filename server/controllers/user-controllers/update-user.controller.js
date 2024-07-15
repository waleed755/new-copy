import userModel from '../../models/user.model.js'
import dotenv from 'dotenv'

dotenv.config()

export const updateUser = async (req, res) => {
  const { userId } = req.params // Extract userId from URL parameter
  const { userData } = req.body
  console.log(' parsedUserData = ', userData)

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // checking if the files/photo exists
    if (req.files && req.files['userPhoto'][0]) {
      // For user image
      const userFile = req.files['userPhoto'][0]

      const userParams = {
        Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
        Key: `${Date.now()}_${userFile.originalname}`,
        Body: userFile.buffer,
        ACL: `${process.env.AWS_S3_ACL}`,
      }

      const userUploadResponse = await s3.upload(userParams).promise()
      userData.userPhoto = userUploadResponse.Location
    }

    // Checking if the password exists
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      userData.password = hashedPassword
    }
    if (userData.email) {
      userData.email = userData.email.trim().toLowerCase()
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, userData, {
      new: true,
    })

    if (!updatedUser) {
      return res.status(404).json({ error: true, message: 'User not Updated!' })
    }

    res.json({ success: true, message: 'User updated successfully' })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
}

export default updateUser
