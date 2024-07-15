import categoryModel from '../../../models/property-select-models/category.model.js'
import userModel from '../../../models/user.model.js'

export const addCategory = async (req, res) => {
  const { data } = req.body

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  try {
    // finding the user
    const user = await userModel.findById(req.userId)

    data.createdByUserId = user._id
    data.createdByUserName = user.fullName
    data.companyId = user.companyId
    data.companyName = user.companyName

    // Creating a new Category Data
    await categoryModel.create(data)

    res.json({ success: true, message: 'Category Added !!!' })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default addCategory
