import userModel from '../../models/user.model.js'

export const updateUserMfa = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  //   ! finding the login user
  const user = await userModel.findById(req.userId)

  try {
    let updatedUser

    if (user.userMfa === 1) {
      updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        { userMfa: 0 },
        {
          new: true,
        }
      )
    } else if (user.userMfa === 0) {
      updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        { userMfa: 1 },
        {
          new: true,
        }
      )
    } else {
      updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        { userMfa: 0 },
        {
          new: true,
        }
      )
    }

    if (!updatedUser) {
      return res.status(404).json({ error: true, message: 'User not Updated!' })
    }

    res.json({
      success: true,
      message: 'Multi Factor Authentication Settings Updated Successfully!',
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message })
  }
}

export default updateUserMfa
