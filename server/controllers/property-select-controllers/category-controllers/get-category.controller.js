import categoryModel from '../../../models/property-select-models/category.model.js'
import userModel from '../../../models/user.model.js'

export const getAllCategory = async (req, res) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    const user = await userModel.findById(req.userId)

    // Extract the companyId from the user document
    const companyId = user.companyId

    const categories = await categoryModel.find({ companyId })
    res.json({ success: true, categories: categories })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default getAllCategory
