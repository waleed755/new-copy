import typeModel from '../../../models/property-select-models/type.model.js'
import userModel from '../../../models/user.model.js'

export const addType = async (req, res) => {
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

    // Creating a new Type Data
    await typeModel.create(data)

    res.json({ success: true, message: 'Type is Added!!' })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default addType
