import aiFilesModel from '../../../../models/property-select-models/ai-files.model.js'
import propertyModel from '../../../../models/property.model.js'
import userModel from '../../../../models/user.model.js'

export const addAIFiles = async (req, res) => {
  const { data } = req.body
  const files = req.files
  const fileUrls = []

  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token' })
  }

  // Save file URLs to the database
  files.forEach(file => {
    // /uploads/
    const url = file.filename
    fileUrls.push(url)
  })

  try {
    //  finding the user
    const user = await userModel.findById(req.userId)

    const aiFilesData = {
      createdByUserId: user._id,
      createdByUserName: user.fullName,
      companyId: user.companyId,
      companyName: user.companyName,
      uploadedFiles: fileUrls,
      customerId: data.customerId,
      propertyId: data.propertyId,
    }

    // Creating a new AI Files Data
    const aiFiles = await aiFilesModel.create(aiFilesData)

    // adding that reference in the property
    const updatedProperty = await propertyModel.findById(data.propertyId)
    updatedProperty.propertyAI.aiFiles = aiFiles._id
    await updatedProperty.save()

    res.json({ success: true, aiFiles: aiFiles })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default addAIFiles
