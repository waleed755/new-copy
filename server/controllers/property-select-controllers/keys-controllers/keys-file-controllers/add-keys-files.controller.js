import keysImagesModel from '../../../../models/property-select-models/keys-images.model.js'
import propertyModel from '../../../../models/property.model.js'
import userModel from '../../../../models/user.model.js'

export const addKeysFiles = async (req, res) => {
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

    const keysFilesData = {
      createdByUserId: user._id,
      createdByUserName: user.fullName,
      uploadedFiles: fileUrls,
      customerId: data.customerId,
      propertyId: data.propertyId,
    }

    // Creating a new Keys Files Data
    const keyFiles = await keysImagesModel.create(keysFilesData)

    // adding that reference in the property
    const updatedProperty = await propertyModel.findById(data.propertyId)
    updatedProperty.propertyKeys.keyImages = keyFiles._id
    await updatedProperty.save()

    res.json({ success: true, keyFiles: keyFiles })
  } catch (error) {
    res.json({ error: true, message: error.message })
  }
}

export default addKeysFiles
