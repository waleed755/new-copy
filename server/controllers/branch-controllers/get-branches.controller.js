import branchModel from '../../models/branch.model.js'
import userModel from '../../models/user.model.js'

export const getAllBranches = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const user = await userModel.findById(req.userId)

    // Extract the companyId from the user document
    const companyId = user.companyId

    const branches = await branchModel.find({ companyId })

    res.json({ success: true, branches: branches })
  } catch (error) {
    res.json({ error: true, message: error })
  }
}

export default getAllBranches
