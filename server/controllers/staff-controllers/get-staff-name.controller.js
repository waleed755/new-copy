import staffModel from '../../models/staff.model.js'
import userModel from '../../models/user.model.js'

export const getAllStaffNames = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const user = await userModel.findById(req.userId)

    // Extract the companyId from the user document
    const companyId = user.companyId

    const staffNames = await staffModel.find({ companyId }, 'staffName')

    res.json({ success: true, staffNames: staffNames })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAllStaffNames
